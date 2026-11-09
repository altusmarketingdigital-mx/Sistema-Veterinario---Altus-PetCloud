const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, requireRoles } = require('../middlewares/auth.middleware');

router.use(authenticateToken);

// GET /api/shifts/current - Obtener el turno de caja abierto actual del usuario o sucursal
router.get('/current', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const branchId = req.branchId;

    let query = `
      SELECT cs.*, u.full_name AS cashier_name, b.name AS branch_name
      FROM cash_shifts cs
      JOIN users u ON cs.user_id = u.id
      LEFT JOIN branches b ON cs.branch_id = b.id
      WHERE cs.status = 'OPEN'
    `;
    const params = [];

    if (branchId) {
      params.push(branchId);
      query += ` AND cs.branch_id = $${params.length}`;
    } else {
      params.push(userId);
      query += ` AND cs.user_id = $${params.length}`;
    }

    query += ` ORDER BY cs.opened_at DESC LIMIT 1`;
    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      return res.json({ success: true, data: null, message: 'No hay turno de caja abierto actualmente.' });
    }

    const currentShift = result.rows[0];

    // Consultar desglose de ventas en tiempo real para este turno
    const salesSummary = await db.query(`
      SELECT 
        payment_method,
        COALESCE(SUM(total), 0) AS total_amount,
        COUNT(id) AS transaction_count
      FROM invoices
      WHERE shift_id = $1
      GROUP BY payment_method
    `, [currentShift.id]);

    // Consultar entradas y salidas de efectivo
    const movementsRes = await db.query(
      'SELECT * FROM cash_movements WHERE shift_id = $1 ORDER BY created_at DESC',
      [currentShift.id]
    );

    res.json({
      success: true,
      data: {
        shift: currentShift,
        sales_summary: salesSummary.rows,
        movements: movementsRes.rows
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/shifts/open - Apertura de turno con fondo inicial en efectivo
router.post('/open', requireRoles('ADMIN', 'RECEPTIONIST'), async (req, res, next) => {
  try {
    const { opening_balance = 0.00, notes } = req.body;
    const userId = req.user.id;
    const tenantId = req.tenantId;
    const branchId = req.branchId;

    // Verificar si ya existe un turno abierto
    const existing = await db.query(
      `SELECT id FROM cash_shifts WHERE user_id = $1 AND status = 'OPEN'`,
      [userId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya cuenta con un turno de caja abierto. Debe cerrarlo antes de iniciar otro.'
      });
    }

    const query = `
      INSERT INTO cash_shifts (tenant_id, branch_id, user_id, opening_balance, expected_cash, notes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await db.query(query, [tenantId, branchId, userId, opening_balance, opening_balance, notes || null]);

    res.status(201).json({
      success: true,
      message: 'Turno de caja aperturado correctamente.',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/shifts/movement - Registrar entrada o salida menor de efectivo
router.post('/movement', requireRoles('ADMIN', 'RECEPTIONIST'), async (req, res, next) => {
  try {
    const { shift_id, type, amount, reason } = req.body;

    if (!shift_id || !type || !amount || !reason) {
      return res.status(400).json({ success: false, message: 'Datos incompletos para el movimiento de caja.' });
    }

    const query = `
      INSERT INTO cash_movements (shift_id, type, amount, reason)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await db.query(query, [shift_id, type.toUpperCase(), amount, reason]);

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/shifts/:id/close - Cierre de turno y Corte Z con cálculo de arqueo
router.post('/:id/close', requireRoles('ADMIN', 'RECEPTIONIST'), async (req, res, next) => {
  const client = await db.getClient();
  try {
    const { id } = req.params;
    const { actual_cash, notes } = req.body;

    await client.query('BEGIN');

    const shiftRes = await client.query('SELECT * FROM cash_shifts WHERE id = $1 FOR UPDATE', [id]);
    if (shiftRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Turno no encontrado.' });
    }

    const shift = shiftRes.rows[0];
    if (shift.status === 'CLOSED') {
      return res.status(400).json({ success: false, message: 'Este turno ya fue cerrado anteriormente.' });
    }

    // Calcular ventas por método de pago vinculadas al turno
    const salesRes = await client.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN payment_method = 'CASH' THEN total ELSE 0 END), 0) AS cash_total,
        COALESCE(SUM(CASE WHEN payment_method IN ('DEBIT_CARD', 'CREDIT_CARD') THEN total ELSE 0 END), 0) AS card_total,
        COALESCE(SUM(CASE WHEN payment_method = 'TRANSFER' THEN total ELSE 0 END), 0) AS transfer_total,
        COALESCE(SUM(total), 0) AS grand_total
      FROM invoices
      WHERE shift_id = $1
    `, [id]);

    const sales = salesRes.rows[0];

    // Calcular movimientos menores de efectivo
    const movRes = await client.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'INFLOW' THEN amount ELSE 0 END), 0) AS inflows,
        COALESCE(SUM(CASE WHEN type = 'OUTFLOW' THEN amount ELSE 0 END), 0) AS outflows
      FROM cash_movements
      WHERE shift_id = $1
    `, [id]);

    const movs = movRes.rows[0];

    // Dinero esperado en efectivo = Fondo inicial + Ventas efectivo + Entradas - Salidas
    const expectedCash = Number(shift.opening_balance) + Number(sales.cash_total) + Number(movs.inflows) - Number(movs.outflows);
    const countedCash = Number(actual_cash !== undefined ? actual_cash : expectedCash);
    const difference = countedCash - expectedCash;

    const closeQuery = `
      UPDATE cash_shifts
      SET 
        closed_at = CURRENT_TIMESTAMP,
        cash_sales = $1,
        card_sales = $2,
        transfer_sales = $3,
        total_sales = $4,
        expected_cash = $5,
        actual_cash = $6,
        difference = $7,
        status = 'CLOSED',
        notes = $8
      WHERE id = $9
      RETURNING *
    `;
    const result = await client.query(closeQuery, [
      sales.cash_total,
      sales.card_total,
      sales.transfer_total,
      sales.grand_total,
      expectedCash,
      countedCash,
      difference,
      notes || null,
      id
    ]);

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Turno de caja cerrado exitosamente (Corte Z generado).',
      data: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

module.exports = router;

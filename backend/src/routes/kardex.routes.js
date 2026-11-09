const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, requireRoles } = require('../middlewares/auth.middleware');

router.use(authenticateToken);

// GET /api/kardex/active - Monitor de hospitalización en tiempo real con semáforo
router.get('/active', async (req, res, next) => {
  try {
    const { criticality } = req.query;
    let query = `
      SELECT 
        hk.*,
        p.id AS patient_id, p.name AS patient_name, p.species, p.breed, p.weight_kg,
        c.first_name || ' ' || c.last_name AS owner_name, c.phone AS owner_phone,
        u.full_name AS vet_name,
        admin_u.full_name AS administered_by_name
      FROM hospitalization_kardex hk
      JOIN medical_records mr ON hk.medical_record_id = mr.id
      JOIN patients p ON mr.patient_id = p.id
      JOIN clients c ON p.client_id = c.id
      JOIN users u ON mr.veterinarian_id = u.id
      LEFT JOIN users admin_u ON hk.administered_by = admin_u.id
      WHERE hk.status = 'PENDING'
    `;
    const params = [];

    if (criticality) {
      params.push(criticality);
      query += ` AND hk.criticality_level = $${params.length}`;
    }

    query += ` ORDER BY hk.scheduled_time ASC`;
    const result = await db.query(query, params);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/kardex/:id/administer - Registrar aplicación de dosis y descontar fármaco si aplica
router.patch('/:id/administer', requireRoles('VETERINARIAN', 'ADMIN'), async (req, res, next) => {
  const client = await db.getClient();
  try {
    const { id } = req.params;
    const administered_by = req.user.id;

    await client.query('BEGIN');

    // 1. Obtener registro de Kardex
    const kardexRes = await client.query('SELECT * FROM hospitalization_kardex WHERE id = $1 FOR UPDATE', [id]);
    if (kardexRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro de Kardex no encontrado.' });
    }

    const item = kardexRes.rows[0];

    // 2. Marcar como administrada
    const updateRes = await client.query(`
      UPDATE hospitalization_kardex
      SET status = 'ADMINISTERED', administered_at = CURRENT_TIMESTAMP, administered_by = $1
      WHERE id = $2
      RETURNING *
    `, [administered_by, id]);

    // 3. Si tiene producto asociado en inventario, descontar 1 unidad
    if (item.product_id) {
      await client.query(`
        UPDATE products 
        SET stock_current = GREATEST(0, stock_current - 1), updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [item.product_id]);
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Dosis administrada y registrada correctamente.',
      data: updateRes.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

module.exports = router;

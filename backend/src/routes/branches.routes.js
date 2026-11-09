const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, requireRoles } = require('../middlewares/auth.middleware');

router.use(authenticateToken);

// GET /api/branches - Listar todas las sucursales de la clínica
router.get('/', async (req, res, next) => {
  try {
    const tenantId = req.tenantId;
    let query = `SELECT * FROM branches WHERE is_active = TRUE`;
    const params = [];

    if (tenantId) {
      params.push(tenantId);
      query += ` AND tenant_id = $1`;
    }

    query += ` ORDER BY name ASC`;
    const result = await db.query(query, params);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    next(error);
  }
});

// POST /api/branches - Crear nueva sucursal (Solo Administrador)
router.post('/', requireRoles('ADMIN'), async (req, res, next) => {
  try {
    const tenantId = req.tenantId || req.body.tenant_id;
    const { name, code, address, phone, ticket_footer_text } = req.body;

    if (!name || !code || !address) {
      return res.status(400).json({ success: false, message: 'Nombre, código y dirección son requeridos.' });
    }

    const query = `
      INSERT INTO branches (tenant_id, name, code, address, phone, ticket_footer_text)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await db.query(query, [
      tenantId,
      name.trim(),
      code.toUpperCase().trim(),
      address.trim(),
      phone || null,
      ticket_footer_text || '¡Gracias por confiar en Altus PetCloud!'
    ]);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// GET /api/branches/:id - Obtener información de una sucursal específica
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM branches WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Sucursal no encontrada.' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

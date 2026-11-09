const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, requireRoles } = require('../middlewares/auth.middleware');

// GET /api/products - Lista de productos (Cualquier usuario autenticado para POS o recetas)
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { search, category } = req.query;
    let query = `SELECT * FROM products WHERE is_active = TRUE`;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (name ILIKE $${params.length} OR barcode ILIKE $${params.length} OR sku ILIKE $${params.length})`;
    }
    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    query += ` ORDER BY name ASC`;
    const result = await db.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/barcode/:barcode - Búsqueda ultra rápida para escáner POS
router.get('/barcode/:barcode', async (req, res, next) => {
  try {
    const { barcode } = req.params;
    const query = `SELECT * FROM products WHERE barcode = $1 AND is_active = TRUE LIMIT 1`;
    const result = await db.query(query, [barcode]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado con el código de barras escaneado' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// POST /api/products - Alta de producto o servicio (RESTRINGIDO EXCLUSIVAMENTE A ADMIN)
router.post('/', authenticateToken, requireRoles('ADMIN'), async (req, res, next) => {
  try {
    const { barcode, sku, name, category, cost_price, sale_price, stock_current, stock_minimum, is_service } = req.body;
    const query = `
      INSERT INTO products (barcode, sku, name, category, cost_price, sale_price, stock_current, stock_minimum, is_service)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [barcode, sku, name, category, cost_price || 0, sale_price, stock_current || 0, stock_minimum || 5, is_service || false];
    const result = await db.query(query, values);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

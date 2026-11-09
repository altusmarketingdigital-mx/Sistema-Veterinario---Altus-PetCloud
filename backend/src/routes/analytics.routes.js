const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, requireRoles } = require('../middlewares/auth.middleware');

router.use(authenticateToken);

// GET /api/analytics/dashboard - Métricas ejecutivas y KPIs de rendimiento clínico/financiero
router.get('/dashboard', requireRoles('ADMIN'), async (req, res, next) => {
  try {
    const tenantId = req.tenantId;

    // 1. Ingresos totales del mes en curso
    const revenueRes = await db.query(`
      SELECT 
        COALESCE(SUM(total), 0) AS monthly_revenue,
        COALESCE(AVG(total), 0) AS average_ticket,
        COUNT(id) AS total_invoices
      FROM invoices
      WHERE created_at >= date_trunc('month', CURRENT_DATE)
    `);

    // 2. Ingresos desglosados por método de pago
    const paymentMethodsRes = await db.query(`
      SELECT 
        payment_method,
        COALESCE(SUM(total), 0) AS total_amount,
        COUNT(id) AS count
      FROM invoices
      WHERE created_at >= date_trunc('month', CURRENT_DATE)
      GROUP BY payment_method
    `);

    // 3. Servicios y productos con mayor recaudación
    const topProductsRes = await db.query(`
      SELECT 
        product_name,
        SUM(quantity) AS units_sold,
        SUM(total_line) AS revenue_generated
      FROM invoice_items
      GROUP BY product_name
      ORDER BY revenue_generated DESC
      LIMIT 5
    `);

    // 4. Conteo de citas por estado
    const appointmentsStatsRes = await db.query(`
      SELECT 
        status,
        COUNT(id) AS total
      FROM appointments
      GROUP BY status
    `);

    // 5. Productividad por profesional veterinario
    const vetProductivityRes = await db.query(`
      SELECT 
        u.full_name AS vet_name,
        COUNT(a.id) AS total_consultations
      FROM appointments a
      JOIN users u ON a.veterinarian_id = u.id
      WHERE a.status = 'COMPLETED'
      GROUP BY u.full_name
      ORDER BY total_consultations DESC
    `);

    res.json({
      success: true,
      data: {
        financials: revenueRes.rows[0],
        payment_methods: paymentMethodsRes.rows,
        top_selling: topProductsRes.rows,
        appointments: appointmentsStatsRes.rows,
        vet_productivity: vetProductivityRes.rows
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

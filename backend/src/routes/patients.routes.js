const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, requireRoles } = require('../middlewares/auth.middleware');

// Todas las consultas de pacientes requieren token activo
router.use(authenticateToken);

// GET /api/patients - Buscar pacientes con tutor
router.get('/', async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = `
      SELECT p.*, c.first_name || ' ' || c.last_name AS owner_name, c.phone AS owner_phone
      FROM patients p
      JOIN clients c ON p.client_id = c.id
      WHERE p.is_active = TRUE
    `;
    const params = [];
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (p.name ILIKE $1 OR c.first_name ILIKE $1 OR c.last_name ILIKE $1 OR p.microchip_number ILIKE $1)`;
    }
    query += ` ORDER BY p.name ASC`;
    const result = await db.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

// GET /api/patients/:id/medical-records - Obtener historial clínico y Kardex
router.get('/:id/medical-records', async (req, res, next) => {
  try {
    const { id } = req.params;
    const records = await db.query(`
      SELECT mr.*, u.full_name AS vet_name
      FROM medical_records mr
      JOIN users u ON mr.veterinarian_id = u.id
      WHERE mr.patient_id = $1
      ORDER BY mr.created_at DESC
    `, [id]);

    res.json({ success: true, data: records.rows });
  } catch (error) {
    next(error);
  }
});

// POST /api/patients/:id/medical-records - Crear historia clínica (SOLO VETERINARIOS Y ADMIN)
router.post('/:id/medical-records', requireRoles('VETERINARIAN', 'ADMIN'), async (req, res, next) => {
  const client = await db.getClient();
  try {
    const { id: patient_id } = req.params;
    const { veterinarian_id, anamnesis, physical_exam, diagnosis, treatment_plan, weight_kg, temperature_celsius, heart_rate_bpm, kardex_items } = req.body;

    await client.query('BEGIN');

    const recordRes = await client.query(`
      INSERT INTO medical_records (patient_id, veterinarian_id, anamnesis, physical_exam, diagnosis, treatment_plan, weight_kg, temperature_celsius, heart_rate_bpm)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [patient_id, veterinarian_id, anamnesis, physical_exam, diagnosis, treatment_plan, weight_kg, temperature_celsius, heart_rate_bpm]);

    const createdRecord = recordRes.rows[0];

    // Si incluye aplicaciones para hospitalización/kardex
    if (kardex_items && Array.isArray(kardex_items)) {
      for (const item of kardex_items) {
        await client.query(`
          INSERT INTO hospitalization_kardex (medical_record_id, product_id, medication_name, dose, route, frequency_hours, scheduled_time)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [createdRecord.id, item.product_id || null, item.medication_name, item.dose, item.route, item.frequency_hours, item.scheduled_time || new Date()]);
      }
    }

    await client.query('COMMIT');
    res.status(201).json({ success: true, data: createdRecord });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

module.exports = router;

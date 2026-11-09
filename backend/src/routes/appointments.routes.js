const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/appointments - Listar citas con filtros por veterinario y rango de fecha
router.get('/', async (req, res, next) => {
  try {
    const { vet_id, status, date } = req.query;
    let query = `
      SELECT 
        a.id, a.scheduled_at, a.estimated_duration_min, a.status, a.reason, a.clinical_notes,
        p.id AS patient_id, p.name AS patient_name, p.species, p.breed,
        c.id AS client_id, c.first_name || ' ' || c.last_name AS client_name, c.phone AS client_phone,
        u.id AS vet_id, u.full_name AS vet_name
      FROM appointments a
      INNER JOIN patients p ON a.patient_id = p.id
      INNER JOIN clients c ON p.client_id = c.id
      LEFT JOIN users u ON a.veterinarian_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (vet_id) {
      params.push(vet_id);
      query += ` AND a.veterinarian_id = $${params.length}`;
    }
    if (status) {
      params.push(status);
      query += ` AND a.status = $${params.length}`;
    }
    if (date) {
      params.push(date);
      query += ` AND DATE(a.scheduled_at) = $${params.length}`;
    }

    query += ` ORDER BY a.scheduled_at ASC`;
    const result = await db.query(query, params);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    next(error);
  }
});

// POST /api/appointments - Crear nueva cita
router.post('/', async (req, res, next) => {
  try {
    const { patient_id, veterinarian_id, scheduled_at, estimated_duration_min = 30, reason, clinical_notes } = req.body;
    
    if (!patient_id || !scheduled_at || !reason) {
      return res.status(400).json({ success: false, message: 'Datos incompletos para agendar cita' });
    }

    const query = `
      INSERT INTO appointments (patient_id, veterinarian_id, scheduled_at, estimated_duration_min, reason, clinical_notes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await db.query(query, [patient_id, veterinarian_id, scheduled_at, estimated_duration_min, reason, clinical_notes]);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/appointments/:id/status - Actualizar estado de la cita
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'

    const query = `UPDATE appointments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`;
    const result = await db.query(query, [status, id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Cita no encontrada' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

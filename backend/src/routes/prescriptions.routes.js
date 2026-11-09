const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, requireRoles } = require('../middlewares/auth.middleware');

router.use(authenticateToken);

// GET /api/prescriptions - Listar recetas con filtros por paciente o fecha
router.get('/', async (req, res, next) => {
  try {
    const { patient_id, vet_id } = req.query;
    let query = `
      SELECT 
        pr.*, 
        p.name AS patient_name, p.species, p.breed,
        c.first_name || ' ' || c.last_name AS owner_name, c.phone AS owner_phone,
        u.full_name AS vet_name, u.professional_license
      FROM prescriptions pr
      JOIN patients p ON pr.patient_id = p.id
      JOIN clients c ON p.client_id = c.id
      JOIN users u ON pr.veterinarian_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (patient_id) {
      params.push(patient_id);
      query += ` AND pr.patient_id = $${params.length}`;
    }
    if (vet_id) {
      params.push(vet_id);
      query += ` AND pr.veterinarian_id = $${params.length}`;
    }

    query += ` ORDER BY pr.created_at DESC`;
    const result = await db.query(query, params);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    next(error);
  }
});

// GET /api/prescriptions/:id - Detalle completo de receta con medicamentos para impresión
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const prescRes = await db.query(`
      SELECT 
        pr.*, 
        p.name AS patient_name, p.species, p.breed, p.weight_kg,
        c.first_name || ' ' || c.last_name AS owner_name, c.phone AS owner_phone,
        u.full_name AS vet_name, u.professional_license, u.email AS vet_email
      FROM prescriptions pr
      JOIN patients p ON pr.patient_id = p.id
      JOIN clients c ON p.client_id = c.id
      JOIN users u ON pr.veterinarian_id = u.id
      WHERE pr.id = $1
    `, [id]);

    if (prescRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Receta médica no encontrada.' });
    }

    const itemsRes = await db.query(
      'SELECT * FROM prescription_items WHERE prescription_id = $1 ORDER BY id ASC',
      [id]
    );

    res.json({
      success: true,
      data: {
        prescription: prescRes.rows[0],
        items: itemsRes.rows
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/prescriptions - Emitir nueva receta médica (Solo Veterinario y Admin)
router.post('/', requireRoles('VETERINARIAN', 'ADMIN'), async (req, res, next) => {
  const client = await db.getClient();
  try {
    const { patient_id, medical_record_id, diagnosis_summary, instructions, items, expires_days = 30 } = req.body;
    const veterinarian_id = req.user.id;
    const tenant_id = req.tenantId;

    if (!patient_id || !diagnosis_summary || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Paciente, diagnóstico y al menos un medicamento son requeridos.'
      });
    }

    await client.query('BEGIN');

    const prescriptionCode = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expires_days);

    const insertPrescQuery = `
      INSERT INTO prescriptions (tenant_id, patient_id, veterinarian_id, medical_record_id, prescription_code, diagnosis_summary, instructions, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const prescRes = await client.query(insertPrescQuery, [
      tenant_id,
      patient_id,
      veterinarian_id,
      medical_record_id || null,
      prescriptionCode,
      diagnosis_summary,
      instructions || 'Seguir tratamiento al pie de la letra y acudir a revisión en caso de efectos adversos.',
      expiresAt
    ]);

    const createdPrescription = prescRes.rows[0];

    // Insertar cada medicamento
    const createdItems = [];
    for (const item of items) {
      const itemRes = await client.query(`
        INSERT INTO prescription_items (prescription_id, product_id, medication_name, dosage, frequency, duration_days, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [
        createdPrescription.id,
        item.product_id || null,
        item.medication_name,
        item.dosage,
        item.frequency,
        item.duration_days || 7,
        item.notes || null
      ]);
      createdItems.push(itemRes.rows[0]);
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Receta médica emitida exitosamente',
      data: {
        prescription: createdPrescription,
        items: createdItems
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

module.exports = router;

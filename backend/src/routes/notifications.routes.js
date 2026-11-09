const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, requireRoles } = require('../middlewares/auth.middleware');

router.use(authenticateToken);

// GET /api/notifications - Historial de notificaciones enviadas
router.get('/', async (req, res, next) => {
  try {
    const query = `
      SELECT nl.*, c.first_name || ' ' || c.last_name AS client_name, p.name AS patient_name
      FROM notification_logs nl
      JOIN clients c ON nl.client_id = c.id
      LEFT JOIN patients p ON nl.patient_id = p.id
      ORDER BY nl.created_at DESC
      LIMIT 50
    `;
    const result = await db.query(query);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    next(error);
  }
});

// POST /api/notifications/whatsapp - Envío de recordatorio o mensaje directo por WhatsApp
router.post('/whatsapp', requireRoles('ADMIN', 'RECEPTIONIST', 'VETERINARIAN'), async (req, res, next) => {
  try {
    const { client_id, patient_id, appointment_id, phone, message_type = 'APPOINTMENT_REMINDER', custom_text } = req.body;

    if (!client_id || !phone) {
      return res.status(400).json({ success: false, message: 'Cliente y número telefónico son obligatorios.' });
    }

    // Consulta de datos de contexto para componer el mensaje oficial Altus PetCloud
    const clientRes = await db.query('SELECT first_name, last_name FROM clients WHERE id = $1', [client_id]);
    const clientName = clientRes.rows[0]?.first_name || 'Estimado Tutor';

    const defaultMessages = {
      APPOINTMENT_REMINDER: `🐾 *Altus PetCloud Informa:* Hola ${clientName}, te recordamos la cita médica programada para tu mascota el día de mañana. En caso de requerir reagendar, contáctanos con anticipación. ¡Te esperamos!`,
      VACCINE_DUE: `💉 *Recordatorio de Vacunación Altus PetCloud:* Hola ${clientName}, a tu compañero le corresponde su refuerzo de vacuna esta semana. Agenda tu cita para mantener su salud al día.`,
      PRESCRIPTION_READY: `📋 *Receta Lista:* Hola ${clientName}, ya puedes consultar y descargar la receta digital y tratamiento de tu mascota desde nuestro portal.`
    };

    const finalBody = custom_text || defaultMessages[message_type] || defaultMessages.APPOINTMENT_REMINDER;
    const providerId = `WA-MSG-${Date.now().toString().slice(-8)}`;

    // Registro del log en la base de datos
    const logQuery = `
      INSERT INTO notification_logs (tenant_id, client_id, patient_id, appointment_id, channel, recipient_phone, message_type, message_body, status, external_provider_id)
      VALUES ($1, $2, $3, $4, 'WHATSAPP', $5, $6, $7, 'SENT', $8)
      RETURNING *
    `;
    const result = await db.query(logQuery, [
      req.tenantId || null,
      client_id,
      patient_id || null,
      appointment_id || null,
      phone,
      message_type,
      finalBody,
      providerId
    ]);

    // Generar enlace directo de WhatsApp Web para ejecución instantánea en navegador
    const waLink = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(finalBody)}`;

    res.status(201).json({
      success: true,
      message: 'Mensaje registrado y despachado para WhatsApp',
      data: {
        log: result.rows[0],
        whatsapp_link: waLink
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const appointmentsRoutes = require('./routes/appointments.routes');
const productsRoutes = require('./routes/products.routes');
const posRoutes = require('./routes/pos.routes');
const patientsRoutes = require('./routes/patients.routes');
const authRoutes = require('./routes/auth.routes');
const branchesRoutes = require('./routes/branches.routes');
const prescriptionsRoutes = require('./routes/prescriptions.routes');
const kardexRoutes = require('./routes/kardex.routes');
const shiftsRoutes = require('./routes/shifts.routes');
const notificationsRoutes = require('./routes/notifications.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de Seguridad y Parseo
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id', 'x-branch-id']
}));
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'Altus PetCloud API',
    brand: 'Altus MKT Digital',
    timestamp: new Date().toISOString()
  });
});

// Rutas de Módulos Principales
app.use('/api/auth', authRoutes);
app.use('/api/branches', branchesRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/pos', posRoutes);
app.use('/api/patients', patientsRoutes);
app.use('/api/prescriptions', prescriptionsRoutes);
app.use('/api/kardex', kardexRoutes);
app.use('/api/shifts', shiftsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Manejo Centralizado de Errores
app.use((err, req, res, next) => {
  console.error('[Altus PetCloud Error]:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor en Altus PetCloud'
  });
});

app.listen(PORT, () => {
  console.log(`🐾 Altus PetCloud Server corriendo en puerto ${PORT}`);
});

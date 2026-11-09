const express = require('express');
const cors = require('cors');
require('dotenv').config();

const appointmentsRoutes = require('./routes/appointments.routes');
const productsRoutes = require('./routes/products.routes');
const posRoutes = require('./routes/pos.routes');
const patientsRoutes = require('./routes/patients.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de Seguridad y Parseo
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
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
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/pos', posRoutes);
app.use('/api/patients', patientsRoutes);

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

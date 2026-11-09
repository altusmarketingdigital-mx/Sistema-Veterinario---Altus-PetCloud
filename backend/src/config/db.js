const { Pool } = require('pg');
require('dotenv').config();

// Pool de conexiones a PostgreSQL optimizado para entornos Serverless / Cloud (Neon, Supabase, Render)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('neon.tech') 
    ? { rejectUnauthorized: false } 
    : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de base de datos:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect()
};

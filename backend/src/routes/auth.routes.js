const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { authenticateToken } = require('../middlewares/auth.middleware');

const JWT_SECRET = process.env.JWT_SECRET || 'altus_petcloud_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

// POST /api/auth/register - Registrar nuevo usuario (Veterinario, Recepcionista o Admin)
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, full_name, role = 'RECEPTIONIST', professional_license, phone } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        message: 'Email, contraseña y nombre completo son obligatorios.'
      });
    }

    // Validar si el usuario ya existe
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'El correo electrónico ya se encuentra registrado en Altus PetCloud.'
      });
    }

    // Hash de contraseña con salt de 12 rondas
    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    const query = `
      INSERT INTO users (email, password_hash, full_name, role, professional_license, phone)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, full_name, role, professional_license, phone, created_at
    `;
    const result = await db.query(query, [
      email.toLowerCase().trim(),
      password_hash,
      full_name.trim(),
      role.toUpperCase(),
      professional_license || null,
      phone || null
    ]);

    const newUser = result.rows[0];

    // Generar token JWT inicial
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        full_name: newUser.full_name
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: newUser,
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login - Autenticación con verificación segura de credenciales
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Debe ingresar email y contraseña.'
      });
    }

    const result = await db.query(
      'SELECT id, email, password_hash, full_name, role, professional_license, phone, is_active FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas.'
      });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Cuenta desactivada. Contacte al Administrador de la clínica.'
      });
    }

    // Comparación segura con bcrypt
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas.'
      });
    }

    // Generar Token JWT con claims
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          professional_license: user.professional_license,
          phone: user.phone
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/profile - Obtener datos del perfil actual validando el token
router.get('/profile', authenticateToken, async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT id, email, full_name, role, professional_license, phone, is_active, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

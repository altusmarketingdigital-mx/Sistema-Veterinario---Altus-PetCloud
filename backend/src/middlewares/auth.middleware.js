const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'altus_petcloud_super_secret_jwt_key_2026';

/**
 * Middleware para autenticar usuarios mediante Bearer Token JWT
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Acceso no autorizado: Token no proporcionado.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, role, full_name }
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Token inválido o expirado. Inicie sesión nuevamente.'
    });
  }
};

/**
 * Middleware de Control de Acceso Basado en Roles (RBAC)
 * @param  {...string} allowedRoles - Lista de roles permitidos ('ADMIN', 'VETERINARIAN', 'RECEPTIONIST')
 */
const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado: El rol '${req.user.role}' no cuenta con los permisos necesarios para realizar esta acción.`
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  requireRoles
};

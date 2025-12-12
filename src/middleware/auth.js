const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware para autenticar tokens JWT
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'Token de acceso requerido',
      });
    }

    const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkey'; // Use fallback for consistency in testing
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Token inválido - usuario no encontrado',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Token inválido',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Token expirado',
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Error de autenticación',
    });
  }
};

/**
 * Generar token JWT para usuario
 */
const generateToken = (user) => {
  const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkey';
  return jwt.sign(
    { id: user.id, email: user.email },
    jwtSecret,
    { expiresIn: '24h' }
  );
};

module.exports = {
  authenticateToken,
  generateToken,
};

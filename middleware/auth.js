const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({
      status: 'fail',
      data: 'Token no proporcionado' // Translated
    });
  }

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({
        status: 'fail',
        data: 'Token inválido' // Translated
      });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;

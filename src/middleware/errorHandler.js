/**
 * Middleware global de manejo de errores
 */
const errorHandler = (err, req, res, next) => {
  // Log error details safely (avoid issues with Jest console mocking)
  const errorDetails = {
    message: err.message,
    name: err.name,
    stack: err.stack,
    statusCode: err.statusCode,
  };

  if (process.env.NODE_ENV === 'test') {
    // In test environment, avoid console.error issues
    console.log('Test Error:', JSON.stringify(errorDetails, null, 2));
  } else {
    console.error('Error:', errorDetails);
  }

  // Errores de validación de Sequelize
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message,
    }));

    return res.status(400).json({
      status: 'fail',
      message: 'Error de validación',
      data: errors,
    });
  }

  // Errores de restricción única de Sequelize
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      status: 'fail',
      message: 'El recurso ya existe',
      data: {
        field: err.errors[0].path,
        message: err.errors[0].message,
      },
    });
  }

  // Errores JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Token inválido',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Token expirado',
    });
  }

  // Errores de base de datos
  if (err.name && err.name.includes('Sequelize')) {
    console.error('Database Error:', err.message);
    return res.status(500).json({
      status: 'error',
      message: 'Error de base de datos',
    });
  }

  // Errores de conexión
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    console.error('Connection Error:', err.message);
    return res.status(503).json({
      status: 'error',
      message: 'Servicio no disponible',
    });
  }

  // Respuesta de error por defecto
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { errorHandler };

const OrderService = require('../services/OrderService');

// @desc    Crear una orden con procesamiento de pago
// @route   POST /orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id; // Obtenido del middleware de autenticaciรณn
    const { items, paymentMethod, paymentDetails } = req.body;

    // Validar datos de entrada
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Los items de la orden son requeridos',
      });
    }

    if (!paymentMethod || !paymentDetails) {
      return res.status(400).json({
        status: 'fail',
        message: 'La informaciรณn de pago es requerida',
      });
    }

    // Validar estructura de items
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          status: 'fail',
          message: 'Cada item debe tener productId y quantity vรกlida',
        });
      }
    }

    // Crear orden usando el servicio
    const order = await OrderService.createOrder(userId, items, {
      paymentMethod,
      paymentDetails,
    });

    res.status(201).json({
      status: 'success',
      data: {
        order,
      },
    });

  } catch (error) {
    // Determinar cรณdigo de estado basado en el tipo de error
    let statusCode = 500;
    if (error.message.includes('Stock insuficiente') ||
        error.message.includes('Producto') ||
        error.message.includes('Datos de pago incompletos')) {
      statusCode = 400;
    } else if (error.message.includes('Pago fallido')) {
      statusCode = 402; // Payment Required
    }

    res.status(statusCode).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// @desc    Obtener historial de รณrdenes del usuario autenticado
// @route   GET /orders
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    // Validar parรกmetros de paginaciรณn
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        status: 'fail',
        message: 'Parรกmetros de paginaciรณn invรกlidos',
      });
    }

    const result = await OrderService.getUserOrders(userId, { page: pageNum, limit: limitNum });

    res.status(200).json({
      status: 'success',
      data: result,
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error obteniendo el historial de รณrdenes',
    });
  }
};

// @desc    Obtener detalles de una orden especรญfica
// @route   GET /orders/:id
// @access  Private
exports.getOrderDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = parseInt(req.params.id);

    if (isNaN(orderId)) {
      return res.status(400).json({
        status: 'fail',
        message: 'ID de orden invรกlido',
      });
    }

    const order = await OrderService.getUserOrder(orderId, userId);

    res.status(200).json({
      status: 'success',
      data: {
        order,
      },
    });

  } catch (error) {
    let statusCode = 500;
    if (error.message.includes('no encontrada') || error.message.includes('permisos')) {
      statusCode = 404;
    }

    res.status(statusCode).json({
      status: 'fail',
      message: error.message,
    });
  }
};

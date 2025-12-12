const OrderRepository = require('../repositories/OrderRepository');
const CreditCardPaymentStrategy = require('./payment/CreditCardPaymentStrategy');
const { Product, sequelize } = require('../models');

/**
 * Servicio de órdenes (Facade Pattern)
 * Centraliza toda la lógica de negocio relacionada con órdenes y pagos
 */
class OrderService {
  constructor() {
    // Estrategias de pago disponibles
    this.paymentStrategies = {
      CreditCard: CreditCardPaymentStrategy,
    };
  }

  /**
   * Crea una orden con procesamiento de pago (operación atómica)
   * @param {number} userId - ID del usuario
   * @param {Array} items - Items de la orden [{ productId, quantity }]
   * @param {Object} paymentInfo - Información de pago
   * @param {string} paymentInfo.paymentMethod - Método de pago ('CreditCard')
   * @param {Object} paymentInfo.paymentDetails - Detalles del pago
   * @returns {Promise<Order>} Orden creada
   */
  async createOrder(userId, items, paymentInfo) {
    const transaction = await sequelize.transaction();

    try {
      // 1. Verificar stock disponible
      const stockAvailable = await OrderRepository.checkStockAvailability(items);
      if (!stockAvailable) {
        throw new Error('Stock insuficiente para uno o más productos');
      }

      // 2. Calcular precio total y preparar items con precios
      const itemsWithPrices = await this._calculateOrderItems(items);

      // 3. Procesar pago usando estrategia seleccionada
      const paymentStrategy = this._getPaymentStrategy(paymentInfo.paymentMethod);
      const paymentResult = await paymentStrategy.processPayment(
        paymentInfo.paymentDetails,
        itemsWithPrices.totalAmount
      );

      if (!paymentResult.success) {
        throw new Error(`Pago fallido: ${paymentResult.message}`);
      }

      // 4. Actualizar stock de productos
      await OrderRepository.updateProductStock(itemsWithPrices.items, transaction);

      // 5. Crear orden con items
      const order = await OrderRepository.createWithItems(
        userId,
        itemsWithPrices.items,
        itemsWithPrices.totalAmount,
        'COMPLETED',
        transaction
      );

      // Commit de la transacción
      await transaction.commit();

      return order;

    } catch (error) {
      // Rollback completo en caso de error
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Obtiene el historial de órdenes de un usuario
   * @param {number} userId - ID del usuario
   * @param {Object} pagination - Opciones de paginación
   * @returns {Promise<Object>} Historial de órdenes paginado
   */
  async getUserOrders(userId, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const result = await OrderRepository.findByUserId(userId, { page, limit });

    return {
      totalItems: result.count,
      totalPages: Math.ceil(result.count / limit),
      currentPage: parseInt(page),
      orders: result.rows,
    };
  }

  /**
   * Obtiene una orden específica de un usuario
   * @param {number} orderId - ID de la orden
   * @param {number} userId - ID del usuario (para verificar propiedad)
   * @returns {Promise<Order>} Orden encontrada
   */
  async getUserOrder(orderId, userId) {
    const order = await OrderRepository.findById(orderId, userId);

    if (!order) {
      throw new Error('Orden no encontrada o no tienes permisos para verla');
    }

    return order;
  }

  /**
   * Calcula los precios y total de los items de la orden
   * @private
   * @param {Array} items - Items básicos [{ productId, quantity }]
   * @returns {Promise<Object>} Items con precios calculados y total
   */
  async _calculateOrderItems(items) {
    const itemsWithPrices = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findByPk(item.productId);

      if (!product) {
        throw new Error(`Producto con ID ${item.productId} no encontrado`);
      }

      // Trabajar con centavos para evitar problemas de precisión decimal
      const unitPrice = Math.round(parseFloat(product.price) * 100);
      const itemTotal = unitPrice * item.quantity;
      totalAmount += itemTotal;

      itemsWithPrices.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: unitPrice / 100, // Convertir de vuelta a dólares
      });
    }

    return {
      items: itemsWithPrices,
      totalAmount: totalAmount / 100, // Convertir de centavos a dólares
    };
  }

  /**
   * Obtiene la estrategia de pago correspondiente
   * @private
   * @param {string} paymentMethod - Método de pago
   * @returns {PaymentStrategy} Instancia de la estrategia de pago
   */
  _getPaymentStrategy(paymentMethod) {
    const StrategyClass = this.paymentStrategies[paymentMethod];

    if (!StrategyClass) {
      throw new Error(`Método de pago no soportado: ${paymentMethod}`);
    }

    return new StrategyClass();
  }
}

module.exports = new OrderService();

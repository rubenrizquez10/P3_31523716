/**
 * Interfaz base para estrategias de pago (Strategy Pattern)
 * Define el contrato que deben implementar todas las estrategias de pago
 */
class PaymentStrategy {
  /**
   * Procesa un pago
   * @param {Object} paymentData - Datos del pago
   * @param {number} amount - Monto a procesar
   * @returns {Promise<Object>} Resultado del procesamiento del pago
   */
  async processPayment(paymentData, amount) {
    throw new Error('Method processPayment must be implemented by subclass');
  }
}

module.exports = PaymentStrategy;

const PaymentStrategy = require('./PaymentStrategy');

/**
 * Estrategia de pago con tarjeta de crédito (Strategy Pattern)
 * Implementa el procesamiento de pagos usando la API externa FakePayment
 */
class CreditCardPaymentStrategy extends PaymentStrategy {
  constructor() {
    super();
    this.apiUrl = 'https://fakepayment.onrender.com/payments';
  }

  /**
   * Procesa un pago usando la API externa de FakePayment
   * @param {Object} paymentData - Datos del pago
   * @param {string} paymentData.cardToken - Token de la tarjeta
   * @param {string} paymentData.currency - Moneda del pago
   * @param {number} amount - Monto a procesar
   * @returns {Promise<Object>} Resultado del procesamiento del pago
   */
  async processPayment(paymentData, amount) {
    try {
      const { cardToken, currency } = paymentData;

      if (!cardToken || !currency) {
        throw new Error('Datos de pago incompletos: cardToken y currency son requeridos');
      }

      // Simular llamada a la API externa (en un entorno real usaríamos axios o fetch)
      const response = await this._callPaymentAPI({
        cardToken,
        currency,
        amount,
      });

      return {
        success: response.success,
        transactionId: response.transactionId,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        transactionId: null,
        message: error.message || 'Error procesando el pago',
      };
    }
  }

  /**
   * Simula la llamada a la API externa de pagos
   * En producción, esto sería una llamada real con axios/fetch
   * @private
   */
  async _callPaymentAPI(paymentPayload) {
    // Simulación de la API externa
    // En un entorno real, usaríamos:
    // const response = await axios.post(this.apiUrl, paymentPayload);

    // Para fines de testing, simulamos diferentes escenarios
    if (paymentPayload.cardToken === 'invalid_token') {
      throw new Error('Tarjeta rechazada por el banco');
    }

    if (paymentPayload.cardToken === 'insufficient_funds') {
      throw new Error('Fondos insuficientes');
    }

    // Simular éxito
    return {
      success: true,
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: 'Pago procesado exitosamente',
    };
  }
}

module.exports = CreditCardPaymentStrategy;

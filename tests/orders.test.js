const request = require('supertest');
const app = require('../src/app');
const { sequelize, Product } = require('../src/models');

describe('Orders API - Transaction Management', () => {
  let testProduct1, testProduct2;

  beforeEach(async () => {
    // Crear productos de prueba con stock suficiente
    testProduct1 = await Product.create({
      name: 'Test Comic 1',
      description: 'Test comic for orders',
      price: 10.99,
      stock: 5,
      publisher: 'Test Publisher',
      sku: `TEST-ORDERS-1-${Date.now()}`,
      categoryId: global.__TEST_CATEGORY_ID__,
    });

    testProduct2 = await Product.create({
      name: 'Test Comic 2',
      description: 'Another test comic for orders',
      price: 15.50,
      stock: 3,
      publisher: 'Test Publisher',
      sku: `TEST-ORDERS-2-${Date.now()}`,
      categoryId: global.__TEST_CATEGORY_ID__,
    });
  });

  describe('POST /orders - Create Order with Payment', () => {
    it('should create order successfully with valid payment and sufficient stock', async () => {
      const orderData = {
        items: [
          { productId: testProduct1.id, quantity: 2 },
          { productId: testProduct2.id, quantity: 1 },
        ],
        paymentMethod: 'CreditCard',
        paymentDetails: {
          cardToken: 'valid_card_token',
          currency: 'USD',
        },
      };

      const initialStock1 = testProduct1.stock;
      const initialStock2 = testProduct2.stock;

      const res = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${global.__TEST_TOKEN__}`)
        .send(orderData);

      expect(res.statusCode).toEqual(201);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.order).toHaveProperty('id');
      expect(res.body.data.order.status).toEqual('COMPLETED');
      expect(res.body.data.order.userId).toEqual(global.__TEST_USER_ID__);
      expect(res.body.data.order.totalAmount).toEqual(37.48); // (2 * 10.99) + (1 * 15.50) = 37.48

      // Verificar que los items se crearon correctamente
      expect(res.body.data.order.OrderItems).toHaveLength(2);

      // Verificar que el stock se redujo correctamente
      const updatedProduct1 = await Product.findByPk(testProduct1.id);
      const updatedProduct2 = await Product.findByPk(testProduct2.id);

      expect(updatedProduct1.stock).toEqual(initialStock1 - 2);
      expect(updatedProduct2.stock).toEqual(initialStock2 - 1);
    });

    it('should fail and rollback when stock is insufficient', async () => {
      const orderData = {
        items: [
          { productId: testProduct1.id, quantity: 10 }, // Más que el stock disponible (5)
        ],
        paymentMethod: 'CreditCard',
        paymentDetails: {
          cardToken: 'valid_card_token',
          currency: 'USD',
        },
      };

      const initialStock1 = testProduct1.stock;
      const initialStock2 = testProduct2.stock;

      const res = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${global.__TEST_TOKEN__}`)
        .send(orderData);

      expect(res.statusCode).toEqual(400);
      expect(res.body.status).toEqual('fail');
      expect(res.body.message).toContain('Stock insuficiente');

      // Verificar que el stock NO se modificó
      const updatedProduct1 = await Product.findByPk(testProduct1.id);
      const updatedProduct2 = await Product.findByPk(testProduct2.id);

      expect(updatedProduct1.stock).toEqual(initialStock1);
      expect(updatedProduct2.stock).toEqual(initialStock2);
    });

    it('should fail and rollback when payment is rejected', async () => {
      const orderData = {
        items: [
          { productId: testProduct1.id, quantity: 1 },
        ],
        paymentMethod: 'CreditCard',
        paymentDetails: {
          cardToken: 'invalid_token', // Token que simula rechazo de pago
          currency: 'USD',
        },
      };

      const initialStock1 = testProduct1.stock;

      const res = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${global.__TEST_TOKEN__}`)
        .send(orderData);

      expect(res.statusCode).toEqual(402); // Payment Required
      expect(res.body.status).toEqual('fail');
      expect(res.body.message).toContain('Pago fallido');

      // Verificar que el stock NO se modificó
      const updatedProduct1 = await Product.findByPk(testProduct1.id);
      expect(updatedProduct1.stock).toEqual(initialStock1);
    });

    it('should fail with invalid request data', async () => {
      const res = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${global.__TEST_TOKEN__}`)
        .send({}); // Request vacío

      expect(res.statusCode).toEqual(400);
      expect(res.body.status).toEqual('fail');
    });

    it('should fail without authentication', async () => {
      const orderData = {
        items: [{ productId: testProduct1.id, quantity: 1 }],
        paymentMethod: 'CreditCard',
        paymentDetails: {
          cardToken: 'valid_card_token',
          currency: 'USD',
        },
      };

      const res = await request(app)
        .post('/orders')
        .send(orderData); // Sin token de autenticación

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /orders - Get User Orders', () => {
    let createdOrder;

    beforeEach(async () => {
      // Crear una orden de prueba
      const orderData = {
        items: [{ productId: testProduct1.id, quantity: 1 }],
        paymentMethod: 'CreditCard',
        paymentDetails: {
          cardToken: 'valid_card_token',
          currency: 'USD',
        },
      };

      const res = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${global.__TEST_TOKEN__}`)
        .send(orderData);

      createdOrder = res.body.data.order;
    });

    it('should get user orders with pagination', async () => {
      const res = await request(app)
        .get('/orders')
        .set('Authorization', `Bearer ${global.__TEST_TOKEN__}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.orders).toBeInstanceOf(Array);
      expect(res.body.data.orders.length).toBeGreaterThan(0);
      expect(res.body.data.totalItems).toBeGreaterThan(0);
      expect(res.body.data.totalPages).toBeGreaterThan(0);
      expect(res.body.data.currentPage).toEqual(1);
    });

    it('should respect pagination parameters', async () => {
      const res = await request(app)
        .get('/orders?page=1&limit=5')
        .set('Authorization', `Bearer ${global.__TEST_TOKEN__}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.currentPage).toEqual(1);
    });

    it('should fail without authentication', async () => {
      const res = await request(app).get('/orders');

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /orders/:id - Get Order Details', () => {
    let createdOrder;

    beforeEach(async () => {
      // Crear una orden de prueba
      const orderData = {
        items: [{ productId: testProduct1.id, quantity: 1 }],
        paymentMethod: 'CreditCard',
        paymentDetails: {
          cardToken: 'valid_card_token',
          currency: 'USD',
        },
      };

      const res = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${global.__TEST_TOKEN__}`)
        .send(orderData);

      createdOrder = res.body.data.order;
    });

    it('should get order details for order owner', async () => {
      const res = await request(app)
        .get(`/orders/${createdOrder.id}`)
        .set('Authorization', `Bearer ${global.__TEST_TOKEN__}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.order.id).toEqual(createdOrder.id);
      expect(res.body.data.order.userId).toEqual(global.__TEST_USER_ID__);
      expect(res.body.data.order.OrderItems).toBeDefined();
    });

    it('should fail with invalid order ID', async () => {
      const res = await request(app)
        .get('/orders/invalid-id')
        .set('Authorization', `Bearer ${global.__TEST_TOKEN__}`);

      expect(res.statusCode).toEqual(400);
      expect(res.body.status).toEqual('fail');
    });

    it('should fail when order does not exist', async () => {
      const res = await request(app)
        .get('/orders/99999')
        .set('Authorization', `Bearer ${global.__TEST_TOKEN__}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body.status).toEqual('fail');
    });

    it('should fail without authentication', async () => {
      const res = await request(app).get(`/orders/${createdOrder.id}`);

      expect(res.statusCode).toEqual(401);
    });
  });
});

const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

describe('Integration Tests', () => {
  describe('Complete Authentication Flow', () => {
    it('should complete full registration and login flow', async () => {
      // Step 1: Register a new user with a unique email
      const uniqueEmail = `integration-${Date.now()}@example.com`;
      const userData = {
        fullName: 'Integration Test User',
        email: uniqueEmail,
        password: 'password123',
      };

      const registerResponse = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(registerResponse.body.status).toBe('success');
      expect(registerResponse.body.message).toBe('Usuario registrado exitosamente');
      expect(registerResponse.body.data).toHaveProperty('token');
      expect(registerResponse.body.data).toHaveProperty('user');

      const authToken = registerResponse.body.data.token;

      // Step 2: Use token to access protected route
      const usersResponse = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(usersResponse.body.status).toBe('success');
      expect(usersResponse.body.message).toBe('Usuarios obtenidos exitosamente');
      expect(usersResponse.body.data.users.length).toBeGreaterThan(0);

      // Step 3: Login with same credentials
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      expect(loginResponse.body.status).toBe('success');
      expect(loginResponse.body.message).toBe('Inicio de sesión exitoso');
      expect(loginResponse.body.data).toHaveProperty('token');
    });
  }); // Cierre del describe 'Complete Authentication Flow'

  describe('Error Handling', () => {
    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/auth/register')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);
    });

    it('should handle missing content-type', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send('raw data')
        .expect(400);
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('La API está funcionando');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('404 Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Ruta no encontrada');
    });
  });
});

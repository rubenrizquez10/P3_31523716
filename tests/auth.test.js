const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

describe('Authentication Endpoints', () => {
  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        fullName: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Usuario registrado exitosamente');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.fullName).toBe(userData.fullName);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user).not.toHaveProperty('password');
      expect(response.body.data).toHaveProperty('token');
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ fullName: 'New User' })
        .expect(400);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Nombre completo, correo electrónico y contraseña son requeridos');
    });

    it('should return 409 for duplicate email', async () => {
      const userData = {
        fullName: 'Duplicate User',
        email: 'duplicate@example.com',
        password: 'password123',
      };

      // Create first user
      await request(app)
        .post('/auth/register')
        .send(userData);

      // Try to create second user with same email
      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('El correo electrónico ya está registrado');
    });

    it('should return 400 for invalid email format', async () => {
      const userData = {
        fullName: 'New User',
        email: 'invalid-email',
        password: 'password123',
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.status).toBe('fail');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Use global test user from test-setup.js
    });

    it('should login user with valid credentials', async () => {
      const loginData = {
        email: global.__TEST_USER__.email,
        password: 'password123',
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Inicio de sesión exitoso');
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data.user).not.toHaveProperty('password');
      expect(response.body.data).toHaveProperty('token');
    });

    it('should return 401 for invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Credenciales inválidas');
    });

    it('should return 401 for invalid password', async () => {
      const loginData = {
        email: global.__TEST_USER__.email,
        password: 'wrongpassword',
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Credenciales inválidas');
    });

    it('should return 400 for missing credentials', async () => {
      const loginData = {
        email: global.__TEST_USER__.email,
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Correo electrónico y contraseña son requeridos');
    });
  });
});

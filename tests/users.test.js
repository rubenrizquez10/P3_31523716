const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

describe('Users Endpoints', () => {
  beforeEach(async () => {
    // Use global test user and token from test-setup.js
    // No need to create a new user or generate a token here
  });

  describe('GET /users', () => {
    it('should return all users with valid token', async () => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${global.__TEST_TOKEN__}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Usuarios obtenidos exitosamente');
      expect(response.body.data.users).toBeInstanceOf(Array);
      expect(response.body.data.count).toBeGreaterThan(0);
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/users')
        .expect(401);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Token de acceso requerido');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.status).toBe('fail');
    });
  });

  describe('GET /users/:id', () => {
    it('should return user by id with valid token', async () => {
      const response = await request(app)
        .get(`/users/${global.__TEST_USER__.id}`)
        .set('Authorization', `Bearer ${global.__TEST_TOKEN__}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Usuario obtenido exitosamente');
      expect(response.body.data.user.id).toBe(global.__TEST_USER__.id);
      expect(response.body.data.user.email).toBe(global.__TEST_USER__.email);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/users/99999')
        .set('Authorization', `Bearer ${global.__TEST_TOKEN__}`)
        .expect(404);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Usuario no encontrado');
    });

    it('should return 401 without token', async () => {
      await request(app)
        .get(`/users/${global.__TEST_USER__.id}`)
        .expect(401);
    });
  });

  describe('POST /users', () => {
    it('should create new user successfully', async () => {
      const uniqueEmail = `jane-${Date.now()}@example.com`;
      const newUserData = {
        fullName: 'Jane Doe',
        email: uniqueEmail,
        password: 'password123',
      };

      const response = await request(app)
        .post('/users')
        .send(newUserData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Usuario creado exitosamente');
      expect(response.body.data.user.fullName).toBe(newUserData.fullName);
      expect(response.body.data.user.email).toBe(newUserData.email);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should return 409 for duplicate email', async () => {
      const uniqueEmail = `anotherjohn-${Date.now()}@example.com`;
      // Create a user first
      await request(app)
        .post('/users')
        .send({
          fullName: 'Another John',
          email: uniqueEmail,
          password: 'password123',
        });

      const duplicateUserData = {
        fullName: 'Another John',
        email: uniqueEmail, // Same email as existing user
        password: 'password123',
      };

      const response = await request(app)
        .post('/users')
        .send(duplicateUserData)
        .expect(409);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('El correo electrónico ya existe');
    });
  });

  describe('PUT /users/:id', () => {
    it('should update user with valid token', async () => {
      const updateData = {
        fullName: 'John Smith',
        email: 'johnsmith@example.com',
      };

      const response = await request(app)
        .put(`/users/${global.__TEST_USER__.id}`)
        .set('Authorization', `Bearer ${global.__TEST_TOKEN__}`)
        .send(updateData)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Usuario actualizado exitosamente');
      expect(response.body.data.user.fullName).toBe(updateData.fullName);
      expect(response.body.data.user.email).toBe(updateData.email);
    });

    it('should return 404 for non-existent user', async () => {
      const updateData = {
        fullName: 'John Smith',
      };

      const response = await request(app)
        .put('/users/99999')
        .set('Authorization', `Bearer ${global.__TEST_TOKEN__}`)
        .send(updateData)
        .expect(404);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Usuario no encontrado');
    });

    it('should return 401 without token', async () => {
      const updateData = {
        fullName: 'John Smith',
      };

      await request(app)
        .put(`/users/${global.__TEST_USER__.id}`)
        .send(updateData)
        .expect(401);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user with valid token', async () => {
      const response = await request(app)
        .delete(`/users/${global.__TEST_USER__.id}`)
        .set('Authorization', `Bearer ${global.__TEST_TOKEN__}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Usuario eliminado exitosamente');

      // Verify user is deleted
      const deletedUser = await User.findByPk(global.__TEST_USER__.id);
      expect(deletedUser).toBeNull();
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .delete('/users/99999')
        .set('Authorization', `Bearer ${global.__TEST_TOKEN__}`)
        .expect(404);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Usuario no encontrado');
    });

    it('should return 401 without token', async () => {
      await request(app)
        .delete(`/users/${global.__TEST_USER__.id}`)
        .expect(401);
    });
  });
});

const request = require('supertest');
const app = require('./app');
const { sequelize, User } = require('./models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret'; // Debe coincidir con el secreto en auth.js

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Recrear tablas para pruebas
});

afterAll(async () => {
  await sequelize.close();
});

describe('Endpoints de Autenticación', () => { // Translated
  it('debería registrar un nuevo usuario', async () => { // Translated
    const res = await request(app)
      .post('/auth/register')
      .send({
        fullName: 'Usuario de Prueba', // Translated
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toEqual('success');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.email).toEqual('test@example.com');
  });

  it('no debería registrar un usuario con un correo electrónico duplicado', async () => { // Translated
    const res = await request(app)
      .post('/auth/register')
      .send({
        fullName: 'Otro Usuario', // Translated
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.status).toEqual('fail');
    expect(res.body.data).toContain('Validation error'); // Keep original error message for consistency
  });

  it('debería iniciar sesión un usuario existente y devolver un token', async () => { // Translated
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('success');
    expect(res.body.data).toHaveProperty('token');
  });

  it('no debería iniciar sesión con contraseña incorrecta', async () => { // Translated
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body.status).toEqual('fail');
    expect(res.body.data).toEqual('Contraseña inválida'); // Translated
  });

  it('no debería iniciar sesión con un correo electrónico inexistente', async () => { // Translated
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body.status).toEqual('fail');
    expect(res.body.data).toEqual('Usuario no encontrado'); // Translated
  });
});

describe('Endpoints de Usuario Protegidos', () => { // Translated
  let authToken;
  let testUserId;

  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Limpiar para pruebas de rutas protegidas
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({ fullName: 'Usuario Protegido', email: 'protected@example.com', password: hashedPassword }); // Translated
    testUserId = user.id;
    authToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
  });

  it('debería permitir el acceso a GET /users con un token válido', async () => { // Translated
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('success');
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('debería denegar el acceso a GET /users sin un token', async () => { // Translated
    const res = await request(app).get('/users');
    expect(res.statusCode).toEqual(401);
    expect(res.body.status).toEqual('fail');
    expect(res.body.data).toEqual('Token no proporcionado'); // Translated
  });

  it('debería denegar el acceso a GET /users con un token inválido', async () => { // Translated
    const res = await request(app)
      .get('/users')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.statusCode).toEqual(403);
    expect(res.body.status).toEqual('fail');
    expect(res.body.data).toEqual('Token inválido'); // Translated
  });

  it('debería permitir el acceso a GET /users/:id con un token válido', async () => { // Translated
    const res = await request(app)
      .get(`/users/${testUserId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('success');
    expect(res.body.data.id).toEqual(testUserId);
  });

  it('debería permitir el acceso a PUT /users/:id con un token válido', async () => { // Translated
    const res = await request(app)
      .put(`/users/${testUserId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ fullName: 'Nombre Actualizado' }); // Translated
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('success');
    expect(res.body.data.fullName).toEqual('Nombre Actualizado'); // Translated
  });

  it('debería permitir el acceso a DELETE /users/:id con un token válido', async () => { // Translated
    const res = await request(app)
      .delete(`/users/${testUserId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(204);
  });
});

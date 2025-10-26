const request = require('supertest');
const app = require('./app');

describe('GET /ping', () => { // Translated
  it('debería responder con estado 200', async () => { // Translated
    const response = await request(app).get('/ping');
    expect(response.statusCode).toBe(200);
  });
});

describe('GET /about', () => { // Translated
  it('debería responder con estado 200', async () => { // Translated
    const response = await request(app).get('/about');
    expect(response.statusCode).toBe(200);
  });
});

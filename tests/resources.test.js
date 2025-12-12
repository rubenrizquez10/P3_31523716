const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/config/database');
const User = require('../src/models/User');

describe('Categories API', () => {
  it('should not allow access without a token', async () => {
    const res = await request(app).get('/categories');
    expect(res.statusCode).toEqual(401);
  });

  it('should create a new category', async () => {
    const uniqueCategoryName = `Test Category ${Date.now()}`;
    const res = await request(app)
      .post('/categories')
      .set('Authorization', `Bearer ${global.__TEST_TOKEN__}`)
      .send({
        name: uniqueCategoryName,
        description: 'A category for testing purposes',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.data.category).toHaveProperty('id');
  });
});

describe('Tags API', () => {
  it('should not allow access without a token', async () => {
    const res = await request(app).get('/tags');
    expect(res.statusCode).toEqual(401);
  });

  it('should create a new tag', async () => {
    const uniqueTagName = `Test Tag ${Date.now()}`;
    const res = await request(app)
      .post('/tags')
      .set('Authorization', `Bearer ${global.__TEST_TOKEN__}`)
      .send({
        name: uniqueTagName,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.data.tag).toHaveProperty('id');
  });
});

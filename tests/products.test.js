const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/config/database');
const User = require('../src/models/User');
const Category = require('../src/models/Category');
const Tag = require('../src/models/Tag');


describe('Products API - Management', () => {
  it('should not allow creating a product without a token', async () => {
    const res = await request(app).post('/products').send({});
    expect(res.statusCode).toEqual(401);
  });

  it('should create a new product', async () => {
    const res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${global.__TEST_TOKEN__}`)
      .send({
        name: 'The Amazing Spider-Man #1',
        description: 'The first issue of The Amazing Spider-Man.',
        price: 3.99,
        stock: 100,
        publisher: 'Marvel',
        sku: 'MAR-ASM-1',
        series: 'The Amazing Spider-Man',
        issue_number: '1',
        categoryId: global.__TEST_CATEGORY_ID__,
        tagIds: [global.__TEST_TAG_ID__],
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.data.product).toHaveProperty('id');
  });
});

describe('Products API - Public', () => {
  let productId;
  let productSlug;

  beforeEach(async () => {
    // Create product for each test since beforeEach in test-setup.js resets the database
    const res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${global.__TEST_TOKEN__}`)
      .send({
        name: 'Batman: The Killing Joke',
        description: 'A classic Batman story.',
        price: 12.99,
        stock: 50,
        publisher: 'DC',
        sku: `DC-BKJ-${Date.now()}`, // Unique SKU to avoid conflicts
        series: 'Batman',
        categoryId: global.__TEST_CATEGORY_ID__,
      });
    productId = res.body.data.product.id;
    productSlug = res.body.data.product.slug;
  });

  it('should get a list of products', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.products).toBeInstanceOf(Array);
  });

  it('should get a single product by id and slug', async () => {
    const res = await request(app).get(`/p/${productId}-${productSlug}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.product.id).toEqual(productId);
  });

  it('should redirect to the correct URL if the slug is wrong', async () => {
    const res = await request(app).get(`/p/${productId}-wrong-slug`);
    expect(res.statusCode).toEqual(301);
    expect(res.headers.location).toEqual(`/p/${productId}-${productSlug}`);
  });
});

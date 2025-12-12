const { sequelize, User, Category, Tag, Product, Order, OrderItem } = require('../src/models'); // Import models and sequelize
const jwt = require('jsonwebtoken'); // Import jwt

beforeEach(async () => {
  // Ensure database is ready
  await sequelize.authenticate();
  await sequelize.sync({ force: true }); // Recreate tables for each test

  // Create a test user
  const testUser = await User.create({
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  });

  // Generate a token for the test user
  const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkey';
  const testToken = jwt.sign({ id: testUser.id }, jwtSecret, {
    expiresIn: '1h',
  });

  // Create a test category
  const testCategory = await Category.create({
    name: 'Test Category',
    description: 'A category for testing purposes',
  });

  // Create a test tag
  const testTag = await Tag.create({
    name: 'Test Tag',
  });

  // Set global variables for tests
  global.__TEST_TOKEN__ = testToken;
  global.__TEST_CATEGORY_ID__ = testCategory.id;
  global.__TEST_TAG_ID__ = testTag.id;
  global.__TEST_USER_ID__ = testUser.id;
  global.__TEST_USER__ = testUser.toJSON(); // Store user object without password
});

afterAll(async () => {
  await sequelize.close();
});

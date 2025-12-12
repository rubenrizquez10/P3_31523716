module.exports = {
  testEnvironment: 'node',
  globalSetup: '<rootDir>/tests/global-setup.js',
  globalTeardown: '<rootDir>/tests/global-teardown.js',
  setupFilesAfterEnv: ['<rootDir>/tests/test-setup.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/app.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  verbose: true,
  maxWorkers: 1, // Run tests serially to avoid database conflicts
  testTimeout: 30000, // Increase timeout for database operations
};

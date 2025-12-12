require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

module.exports = async () => {
  // Ensure the database file is removed before syncing
  const dbPath = process.env.DB_PATH 
    ? path.resolve(__dirname, '..', process.env.DB_PATH)
    : path.resolve(__dirname, '../database.sqlite');
  try {
    await fs.unlink(dbPath);
  } catch (error) {
    if (error.code !== 'ENOENT') { // Ignore if file doesn't exist
      throw error;
    }
  }
  // No database sync or data creation here, it will be handled by beforeEach in test files
};

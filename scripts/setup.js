const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up API Security Project...\n');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from env.example');
  } else {
    const envContent = `NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-here-${Date.now()}
DB_PATH=./database.sqlite`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file with default values');
  }
} else {
  console.log('ℹ .env file already exists');
}

// Create database directory if it doesn't exist
const dbDir = path.join(__dirname, '..', 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('✅ Created database directory');
}

console.log('\n🎉 Setup complete!');
console.log('\nNext steps:');
console.log('1. Update .env file with your configuration');
console.log('2. Run: npm install');
console.log('3. Run: npm run dev');
console.log('4. Visit: http://localhost:3000/api-docs');

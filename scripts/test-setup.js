const fs = require('fs');
const path = require('path');

console.log('🧪 Testing project setup...\n');

const requiredFiles = [
  'package.json',
  'src/app.js',
  'src/config/database.js',
  'src/models/User.js',
  'src/middleware/auth.js',
  'src/middleware/errorHandler.js',
  'src/routes/auth.js',
  'src/routes/users.js',
  'tests/setup.js',
  'tests/auth.test.js',
  'tests/users.test.js',
  'tests/integration.test.js',
  '.github/workflows/ci.yml',
  'render.yaml',
  'README.md'
];

const missingFiles = [];
const existingFiles = [];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    existingFiles.push(file);
  } else {
    missingFiles.push(file);
  }
});

console.log(`✅ Found ${existingFiles.length} required files`);
if (missingFiles.length > 0) {
  console.log(`❌ Missing ${missingFiles.length} files:`);
  missingFiles.forEach(file => console.log(`   - ${file}`));
} else {
  console.log('🎉 All required files are present!');
}

// Check package.json structure
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  const requiredDeps = ['express', 'sequelize', 'sqlite3', 'bcryptjs', 'jsonwebtoken'];
  const requiredDevDeps = ['jest', 'supertest', 'nodemon'];
  
  console.log('\n📦 Checking dependencies...');
  
  const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
  const missingDevDeps = requiredDevDeps.filter(dep => !packageJson.devDependencies[dep]);
  
  if (missingDeps.length === 0 && missingDevDeps.length === 0) {
    console.log('✅ All required dependencies are present');
  } else {
    console.log('❌ Missing dependencies:');
    [...missingDeps, ...missingDevDeps].forEach(dep => console.log(`   - ${dep}`));
  }
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

console.log('\n🚀 Setup verification complete!');
console.log('\nNext steps:');
console.log('1. Run: npm install');
console.log('2. Run: npm run dev');
console.log('3. Test: npm test');
console.log('4. Visit: http://localhost:3000/api-docs');

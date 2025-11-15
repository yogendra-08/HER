/**
 * Test script to verify backend connection
 * Run this to test if the backend is properly set up
 * 
 * Note: This requires axios. Install with: npm install axios
 * Or use curl commands instead
 */

let axios;
try {
  axios = require('axios');
} catch (error) {
  console.log('⚠️  axios not found. Install with: npm install axios');
  console.log('💡 Or use curl commands to test:\n');
  console.log('Health check:');
  console.log('  curl http://localhost:5000/health\n');
  console.log('Register:');
  console.log('  curl -X POST http://localhost:5000/api/auth/register \\');
  console.log('    -H "Content-Type: application/json" \\');
  console.log('    -d \'{"name":"Test","email":"test@test.com","password":"test123"}\'\n');
  process.exit(0);
}

const BASE_URL = 'http://localhost:5000';

async function testConnection() {
  console.log('🧪 Testing Backend Connection...\n');

  // Test 1: Health Check
  try {
    console.log('1️⃣ Testing Health Endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    console.error('💡 Make sure the backend server is running: cd backendjs && npm run dev');
    return;
  }

  // Test 2: Register Endpoint
  try {
    console.log('\n2️⃣ Testing Register Endpoint...');
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'test123456',
      phone: '1234567890',
      address: 'Test Address'
    };
    
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
    console.log('✅ Register endpoint works:', registerResponse.data.message);
    console.log('   User ID:', registerResponse.data.data.user.id);
    
    // Test 3: Login with registered user
    console.log('\n3️⃣ Testing Login Endpoint...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login endpoint works:', loginResponse.data.message);
    console.log('   Token received:', loginResponse.data.data.token ? 'Yes' : 'No');
    
    console.log('\n✅ All tests passed! Backend is properly connected.');
  } catch (error) {
    if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.data);
    } else {
      console.error('❌ Connection Error:', error.message);
      console.error('💡 Make sure the backend server is running: cd backendjs && npm run dev');
    }
  }
}

// Run tests
testConnection();


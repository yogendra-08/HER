/**
 * Quick Server Test
 * Run: node test-server.js
 */

const axios = require('axios');

async function testServer() {
  console.log('🧪 Testing Backend Server...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣  Testing Health Endpoint...');
    const health = await axios.get('http://localhost:5000/health');
    console.log('   ✅ Server is running!');
    console.log('   📝 Response:', health.data.message);
    
    // Test 2: Register
    console.log('\n2️⃣  Testing Register Endpoint...');
    const testEmail = `test${Date.now()}@test.com`;
    const register = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: testEmail,
      password: 'test123',
      phone: '1234567890',
      address: 'Test Address'
    });
    console.log('   ✅ Register Success!');
    console.log('   📧 Email:', testEmail);
    console.log('   🔑 Token:', register.data.data?.token ? 'Received' : 'Missing');
    
    // Test 3: Login
    console.log('\n3️⃣  Testing Login Endpoint...');
    const login = await axios.post('http://localhost:5000/api/auth/login', {
      email: testEmail,
      password: 'test123'
    });
    console.log('   ✅ Login Success!');
    console.log('   🔑 Token:', login.data.data?.token ? 'Received' : 'Missing');
    
    console.log('\n✅ All tests passed! Backend is working correctly! 🎉');
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Cannot connect to server!');
      console.log('💡 Make sure backend is running:');
      console.log('   cd backendjs');
      console.log('   npm run dev');
    } else if (error.response) {
      console.log('⚠️  Server responded with error:');
      console.log('   Status:', error.response.status);
      console.log('   Message:', error.response.data?.message || error.response.statusText);
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

testServer();


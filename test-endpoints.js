/**
 * Test Script for SmartDev Backend API
 * Tests all endpoints with MongoDB
 */

const http = require('http');

const BASE_URL = 'http://localhost:3001';
let authToken = null;
let userId = null;
let bookingId = null;
let consultationId = null;

const makeRequest = (method, path, data = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` })
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, body: response });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
};

const test = async (name, method, path, data = null, expectedStatus = 200) => {
  try {
    const { status, body } = await makeRequest(method, path, data);
    const success = status === expectedStatus;
    console.log(`${success ? '✅' : '❌'} ${name}`);
    console.log(`   Status: ${status} (Expected: ${expectedStatus})`);
    if (!success || process.env.DEBUG) {
      console.log(`   Response:`, JSON.stringify(body).substring(0, 200));
    }
    return { status, body };
  } catch (error) {
    console.log(`❌ ${name} - ${error.message}`);
    return null;
  }
};

const runTests = async () => {
  console.log('\n🚀 Starting SmartDev Backend API Tests\n');
  console.log('━'.repeat(60));

  // Test 1: Health Check
  console.log('\n📍 TEST 1: Health Check');
  await test('Health endpoint', 'GET', '/api/health', null, 200);

  // Test 2: Register User
  console.log('\n📍 TEST 2: Authentication Tests');
  const registerRes = await test(
    'Register new user',
    'POST',
    '/api/auth/register',
    {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'Test123!@#',
      phone: '+1234567890'
    },
    200
  );

  if (registerRes?.body?.user?.id) {
    userId = registerRes.body.user.id;
    console.log(`   ℹ️  User ID: ${userId}`);
  }

  // Test 3: Login
  const loginRes = await test(
    'Login user',
    'POST',
    '/api/auth/login',
    {
      email: 'test@example.com',
      password: 'Test123!@#'
    },
    200
  );

  if (loginRes?.body?.token) {
    authToken = loginRes.body.token;
    console.log(`   ℹ️  Auth Token: ${authToken.substring(0, 20)}...`);
  }

  // Test 4: Get User Profile
  console.log('\n📍 TEST 3: User Profile Tests');
  await test('Get user profile', 'GET', '/api/user/profile', null, 200);

  // Test 5: Update User Profile
  await test(
    'Update user profile',
    'PUT',
    '/api/user/profile',
    {
      firstName: 'Updated',
      company: 'SmartDev Inc'
    },
    200
  );

  // Test 6: Create Booking
  console.log('\n📍 TEST 4: Booking Tests');
  const bookingRes = await test(
    'Create booking',
    'POST',
    '/api/booking',
    {
      serviceName: 'Web Development',
      title: 'E-commerce Platform',
      description: 'Build a complete e-commerce platform',
      budget: 5000,
      timeline: '3 months'
    },
    200
  );

  if (bookingRes?.body?.booking?.id) {
    bookingId = bookingRes.body.booking.id;
    console.log(`   ℹ️  Booking ID: ${bookingId}`);
  }

  // Test 7: Get All Bookings
  await test('Get all bookings', 'GET', '/api/booking', null, 200);

  // Test 8: Create Consultation
  console.log('\n📍 TEST 5: Consultation Tests');
  const consultationRes = await test(
    'Create consultation',
    'POST',
    '/api/consultation',
    {
      email: 'test@example.com',
      name: 'Test User',
      projectType: 'web-app',
      initialMessage: 'I need help with my web application'
    },
    200
  );

  if (consultationRes?.body?.consultation?.id) {
    consultationId = consultationRes.body.consultation.id;
    console.log(`   ℹ️  Consultation ID: ${consultationId}`);
  }

  // Test 9: Get Notifications
  console.log('\n📍 TEST 6: Notification Tests');
  await test('Get notifications', 'GET', '/api/notifications', null, 200);

  // Test 10: Database Verification
  console.log('\n📍 TEST 7: Database Verification');
  console.log('   ℹ️  User created: ' + (userId ? '✅' : '❌'));
  console.log('   ℹ️  Authentication working: ' + (authToken ? '✅' : '❌'));
  console.log('   ℹ️  Booking saved: ' + (bookingId ? '✅' : '❌'));
  console.log('   ℹ️  Consultation created: ' + (consultationId ? '✅' : '❌'));

  console.log('\n' + '━'.repeat(60));
  console.log('✅ All tests completed!\n');
  process.exit(0);
};

// Run tests
runTests().catch(error => {
  console.error('Test suite error:', error);
  process.exit(1);
});

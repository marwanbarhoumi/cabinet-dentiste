const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
require('dotenv').config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('🔐 Auth Routes', () => {

  const testUser = {
    name: 'Test User',
    email: `test_${Date.now()}@test.com`,
    password: '123456',
    phone: '+216 00 000 000',
  };

  let token = '';

  // ✅ Register
  test('POST /api/auth/register — should create a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toBe(testUser.email);
    expect(res.body.role).toBe('client');
  });

  // ✅ Register duplicate
  test('POST /api/auth/register — should fail on duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email déjà utilisé');
  });

  // ✅ Login
  test('POST /api/auth/login — should login successfully', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  // ✅ Login wrong password
  test('POST /api/auth/login — should fail with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });

    expect(res.statusCode).toBe(401);
  });

  // ✅ Get me
  test('GET /api/auth/me — should return current user', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(testUser.email);
  });

  // ✅ Get me without token
  test('GET /api/auth/me — should fail without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });
});
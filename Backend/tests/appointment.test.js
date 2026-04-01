const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
require('dotenv').config();

let clientToken = '';
let appointmentId = '';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Register + Login client
  const email = `client_${Date.now()}@test.com`;
  await request(app).post('/api/auth/register').send({
    name: 'Client Test',
    email,
    password: '123456',
  });

  const res = await request(app).post('/api/auth/login').send({
    email,
    password: '123456',
  });

  clientToken = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('📅 Appointment Routes', () => {

  // ✅ Create appointment
  test('POST /api/appointments — should create appointment', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        date: '2025-12-01',
        time: '09:00',
        type: 'consultation',
        notes: 'Test RDV',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.status).toBe('pending');
    appointmentId = res.body._id;
  });

  // ✅ Get my appointments
  test('GET /api/appointments/my — should return my appointments', async () => {
    const res = await request(app)
      .get('/api/appointments/my')
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // ✅ Cancel appointment
  test('PATCH /api/appointments/:id/cancel — should cancel appointment', async () => {
    const res = await request(app)
      .patch(`/api/appointments/${appointmentId}/cancel`)
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.appointment.status).toBe('cancelled');
  });

  // ✅ Create without token
  test('POST /api/appointments — should fail without token', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({ date: '2025-12-01', time: '09:00', type: 'consultation' });

    expect(res.statusCode).toBe(401);
  });
});
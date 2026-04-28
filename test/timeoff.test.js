const request = require('supertest');
const express = require('express');

const balance = require('../src/balance');
const reqHandler = require('../src/request');
const hcm = require('../src/hcm.mock');

// Create test app (isolated from real server)
const app = express();
app.use(express.json());

// In-memory store for tests
const balances = {};
app.locals.balances = balances;

// Routes (same as production)
app.get('/balances/:employeeId/:locationId', balance.getBalance);
app.post('/sync/batch', balance.batchSync);
app.post('/requests', reqHandler.createRequest);
app.post('/hcm/validate', hcm.validate);

describe('TimeOff Microservice', () => {

  // 1. Batch sync test
  test('should sync balances from HCM batch', async () => {
    const res = await request(app)
      .post('/sync/batch')
      .send([{ employeeId: '1', locationId: 'A', balance: 10 }]);

    expect(res.body.success).toBe(true);
  });

  // 2. Balance fetch test
  test('should return employee balance', async () => {
    await request(app)
      .post('/sync/batch')
      .send([{ employeeId: '1', locationId: 'A', balance: 10 }]);

    const res = await request(app).get('/balances/1/A');

    expect(res.body.employeeId).toBe('1');
    expect(res.body.locationId).toBe('A');
  });

  // 3. Successful request test
  test('should approve valid time-off request', async () => {
    await request(app)
      .post('/sync/batch')
      .send([{ employeeId: '1', locationId: 'A', balance: 10 }]);

    const res = await request(app)
      .post('/requests')
      .send({
        employeeId: '1',
        locationId: 'A',
        daysRequested: 2
      });

    expect(res.body.status).toBe('APPROVED');
    expect(res.body.daysRequested).toBe(2);
  });

  // 4. Insufficient balance test
  test('should reject request when balance is insufficient', async () => {
    const res = await request(app)
      .post('/requests')
      .send({
        employeeId: '1',
        locationId: 'A',
        daysRequested: 999
      });

    expect(res.status).toBe(400);
  });

});
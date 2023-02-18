'use strict';

const request = require('supertest');
const app = require('../../../bin/www');

describe('testing api/advertisement', () => {
  it('should return advertisements when call the route', async () => {
    const response = await request(app).get('/api/advertisement');
    expect.assertions(3);
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body.result).toBeDefined();
  });
});

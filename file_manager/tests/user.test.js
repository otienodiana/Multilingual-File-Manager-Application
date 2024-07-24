const request = require('supertest');
const app = require('../app'); // Your Express app

test('POST /register should register a user', async () => {
  const response = await request(app)
    .post('/register')
    .send({ username: 'testuser', password: 'testpass' });
  expect(response.statusCode).toBe(200);
});

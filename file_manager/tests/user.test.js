const request = require('supertest');
const app = require('../app'); // Adjust the path if needed

describe('User API', () => {
    test('should register a new user', async () => {
        const response = await request(app)
          .post('/register')
          .send({
            username: 'newuser',
            password: 'password123'
          });
      
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });      

  it('should not register a user with an existing username', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        username: 'existinguser',
        password: 'password123'
      });
    
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'existinguser',
        password: 'password123'
      });
    expect(response.status).toBe(400);
  });
});

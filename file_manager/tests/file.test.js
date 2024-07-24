const request = require('supertest');
const express = require('express');
const app = require('../app'); // Import your Express app

describe('File Routes', () => {
  let server;

  beforeAll(done => {
    server = app.listen(3000, done); // Start the server before tests
  });

  afterAll(done => {
    server.close(done); // Close the server after tests
  });

  it('should upload a file', async () => {
    try {
      const response = await request(app)
        .post('/upload')
        .attach('file', 'tests/files/test-file.txt') // Provide the path to a test file
        .set('Authorization', 'Bearer your-token'); // If authentication is required

      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('File upload queued');
    } catch (error) {
      console.error('Error during file upload test:', error);
      throw error;
    }
  });
});

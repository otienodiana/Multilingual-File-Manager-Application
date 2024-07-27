const request = require('supertest');
const app = require('../app'); // Adjust the path as necessary
const sequelize = require('../config/db');
const File = require('../models/fileModel');
const fs = require('fs');
const path = require('path');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('File Management', () => {
  it('should upload a file', async () => {
    const response = await request(app)
      .post('/files/upload')
      .attach('file', path.join(__dirname, 'testfile.txt')); // Ensure this file exists

    expect(response.status).toBe(200);
    expect(response.text).toContain('File uploaded successfully');
    
    const file = await File.findOne({ where: { filename: 'testfile.txt' } });
    expect(file).not.toBeNull();
  });

  it('should delete a file', async () => {
    const file = await File.create({ filename: 'deletefile.txt', path: '/path/to/file' });

    const response = await request(app)
      .delete(`/files/${file.id}`);

    expect(response.status).toBe(200);
    expect(response.text).toContain('File deleted');

    const deletedFile = await File.findByPk(file.id);
    expect(deletedFile).toBeNull();
  });

  it('should update a file', async () => {
    const file = await File.create({ filename: 'updatefile.txt', path: '/path/to/file' });

    const response = await request(app)
      .put(`/files/${file.id}`)
      .attach('file', path.join(__dirname, 'newfile.txt')); // Ensure this file exists

    expect(response.status).toBe(200);
    expect(response.text).toContain('File updated');

    const updatedFile = await File.findByPk(file.id);
    expect(updatedFile.filename).toBe('newfile.txt');
  });
});

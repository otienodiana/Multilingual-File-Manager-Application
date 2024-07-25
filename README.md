# Multilingual-File-Manager-Application

This project was developed by Engineer Flore and Diana Started on  21st Sunday 2024

 it('should get all files for a user', async () => {
    const response = await request(app)
      .get('/files')
      .set('Authorization', 'Bearer your-token');

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should update a file', async () => {
    const response = await request(app)
      .put('/files/1')
      .send({ name: 'new-name.txt', size: 123, path: '/new/path' })
      .set('Authorization', 'Bearer your-token');

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('new-name.txt');
  });

  it('should delete a file', async () => {
    const response = await request(app)
      .delete('/files/1')
      .set('Authorization', 'Bearer your-token');

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('File deleted');
  });
});

 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },


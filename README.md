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

#DOCUMENTATION FOR ZUNGU PROJECT

# TITLE:
ZUNGU Multilingual File Manager Application


# Description:
ZUNGU is a Node.js application designed to manage file uploads, downloads, and deletions with support for multiple languages. It features user authentication, file management, and a user-friendly interface.

# Features:
Multi-user file management.
File uploads and deletions.
Support for multiple languages using i18n.
Authentication using Passport.js.
File management with Sequelize and MySQL.

# INSTALLATION
Prerequisites:
Node.js
MySQL
Redis (for session management, if applicable)

# Steps
# Clone the Repository
git clone https://github.com/otienodiana/Multilingual-File-Manager-Application.git
# cd your-repo
# Install Dependencies 
npm install

# Create a .env File

# Configure Environment Variables:
Edit .env and set your environment variables such as SECRETKEY, DATABASE_URL, etc.

# Set Up the Database:

Ensure MySQL is running and create a database for the application.
Update the database configuration in config/database.js

# CONFIGURATION
Configuration Files:
# env: Stores environment variables.
# config/database.js: Contains database connection settings.
# config/passport.js: Passport.js configuration for authentication

# USAGE
# staring server
Node app.js then navigate http://localhost:3000

# Endpoints:
GET /: Home page.
POST /files/upload: Upload a file.
GET /uploads/:filename: View/download a file.
DELETE /files/:id: Delete a file.
GET /manage-files: Manage files 

# Application structure
# Main Directories:
/routes: Contains route definitions.
/models: Contains database models.
/middleware: Custom middleware functions.
/views: EJS templates for the front-end.
/uploads: Directory for storing uploaded files.
/config:contains application configuration
/controllers:containg the file anduser logic
/tests:contains the tests fo the application modules
/public:contains the static files for the project
/utils:contains the redis file for queueing

# Files
Each directory has its own  files e.g

app.js: Main application file.
config/db.js: Database configuration.
config/passport.js: Passport.js configuration.
models/fileModel.js: Sequelize model for files.

# Routes
# Files Routes (fileRoutes.js)
POST /files/upload: Uploads a file.
DELETE /files/:id: Deletes a file.
GET /files/:id: Retrieves file details
# Authentication Routes (authRoutes.js):
POST /auth/register: User registration.
POST /auth/login: User login.
GET /auth/logout: User logout.

# Middleware
# Custom Middleware (authMiddleware.js):
ensureAuthenticated: Ensures the user is authenticated.

# Models
# File Model (fileModel.js):
createFile(fileData, callback): Inserts a new file.
getFileById(id, callback): Retrieves a file by ID.
updateFileById(id, fileData, callback): Updates a file.
deleteFileById(id, callback): Deletes a file.
listFilesForUser(userId, callback): Lists files for a user.


# TESTING
Running Tests:
Use Mocha and Node assertion library for testing.
RUN npm test

# Contributing
Fork the repository and create a pull request.
Ensure your code adheres to the project's coding standards.

# License



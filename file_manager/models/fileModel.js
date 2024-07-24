const db = require('../config/db');

// Create a file entry
const createFile = (fileData, callback) => {
  const query = 'INSERT INTO files SET ?';
  db.query(query, fileData, callback);
};

// Read a file entry by ID
const getFileById = (id, callback) => {
  const query = 'SELECT * FROM files WHERE id = ?';
  db.query(query, [id], callback);
};

// Update a file entry by ID
const updateFileById = (id, fileData, callback) => {
  const query = 'UPDATE files SET ? WHERE id = ?';
  db.query(query, [fileData, id], callback);
};

// Delete a file entry by ID
const deleteFileById = (id, callback) => {
  const query = 'DELETE FROM files WHERE id = ?';
  db.query(query, [id], callback);
};

// List all files for a user
const listFilesForUser = (userId, callback) => {
  const query = 'SELECT * FROM files WHERE user_id = ?';
  db.query(query, [userId], callback);
};

module.exports = {
  createFile,
  getFileById,
  updateFileById,
  deleteFileById,
  listFilesForUser
};

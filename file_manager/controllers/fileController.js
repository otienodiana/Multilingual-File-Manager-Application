const path = require('path');
const fs = require('fs');
const multer = require('multer');
const fileModel = require('../models/fileModel');

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // directory where files will be stored
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // append date to avoid filename conflicts
    }
});
  
const upload = multer({ storage });

// Create a file entry
const createFile = (req, res) => {
  const file = req.file;
  const userId = req.body.user_id;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const fileData = {
    user_id: userId,
    filename: file.originalname,
    filepath: file.path,
    size: file.size
  };

  fileModel.createFile(fileData, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ id: result.insertId, ...fileData });
  });
};

// Read a file entry by ID
const getFileById = (req, res) => {
  const fileId = req.params.id;

  fileModel.getFileById(fileId, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send('File not found.');
    res.status(200).send(result[0]);
  });
};

// Update a file entry by ID
const updateFileById = (req, res) => {
  const fileId = req.params.id;
  const fileData = req.body;

  fileModel.updateFileById(fileId, fileData, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('File not found.');
    res.status(200).send('File updated.');
  });
};

// Delete a file entry by ID
const deleteFileById = (req, res) => {
  const fileId = req.params.id;

  fileModel.getFileById(fileId, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send('File not found.');

    // Delete the file from filesystem
    fs.unlink(result[0].filepath, (err) => {
      if (err) return res.status(500).send(err);
    });

    // Delete the file record from database
    fileModel.deleteFileById(fileId, (err) => {
      if (err) return res.status(500).send(err);
      res.status(200).send('File deleted.');
    });
  });
};

// List all files for a user
const listFilesForUser = (req, res) => {
  const userId = req.params.userId;

  fileModel.listFilesForUser(userId, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(result);
  });
};

module.exports = {
  upload,
  createFile,
  getFileById,
  updateFileById,
  deleteFileById,
  listFilesForUser
};

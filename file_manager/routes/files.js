const express = require('express');
const File = require('../models/file');
const multer = require('multer');
const db = require('../config/db');
const fileQueue = require('../config/queue');
const router = express.Router();

const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the upload destination folder
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Define the /upload route
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Add a job to the queue
  fileQueue.add({
    fileName: req.file.filename
  });
  res.send('File upload queued');
});

// Define additional file routes here

module.exports = router;
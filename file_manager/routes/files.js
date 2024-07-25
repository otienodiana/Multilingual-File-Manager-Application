const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

// Define routes and map them to controller functions
router.post('/upload', fileController.upload.single('file'), fileController.createFile);
router.get('/:id', fileController.getFileById);
router.put('/:id', fileController.updateFileById);
router.delete('/:id', fileController.deleteFileById);
router.get('/user/:userId', fileController.listFilesForUser);

module.exports = router;

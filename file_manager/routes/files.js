const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
require('../middleware/authMiddleware');
const fileController = require('../controllers/fileController');
const methodOverride = require('method-override'); // Require the method-override module

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage: storage });

// Use method override to support PUT and DELETE methods
router.use(methodOverride('_method'));

// Define routes and map them to controller functions
router.get('/', fileController.getAllFiles);
router.post('/upload', fileController.upload.single('file'), fileController.createFile);
router.get('/:id', fileController.getFileById);
router.put('/:id', fileController.updateFileById);
router.delete('/:id', fileController.deleteFileById);
router.get('/user/:userId', (req, res) => {
    const userId = req.params.userId;

    fileController.listFilesForUser(userId, (err, files) => {
        if (err) return res.status(500).send(err);
        res.render('manage-files', { files }); // Pass the files array to the view
    });
});

// Route to get all files


module.exports = router;

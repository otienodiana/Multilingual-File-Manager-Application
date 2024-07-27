const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fileController = require('../controllers/fileController');
const methodOverride = require('method-override');

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

router.post('/upload', upload.single('file'), fileController.createFile);
router.get('/:id', fileController.getFileById);
router.put('/:id',upload.single('file'), fileController.updateFileById);
router.delete('/:id', fileController.deleteFileById);
router.get('/user/:userId', fileController.listFilesForUser);
router.get('uploads/:id/', fileController.viewFileById);

module.exports = router;

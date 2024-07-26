const multer = require('multer');
const path = require('path');
const fileModel = require('../models/fileModel');

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
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
        res.status(201).send({ id: result.id, ...fileData });
    });
};

// Get a file by ID
const getFileById = (req, res) => {
    const fileId = req.params.id;

    fileModel.getFileById(fileId, (err, file) => {
        if (err) return res.status(500).send(err);
        if (!file) return res.status(404).send('File not found.');
        res.status(200).send(file);
    });
};

// Update a file by ID
const updateFileById = (req, res) => {
    const fileId = req.params.id;
    const fileData = req.body;

    fileModel.updateFileById(fileId,  (err, result) => {
        if (err) return res.status(500).send(err);
        if (result[0] === 0) return res.status(404).send('File not found.');
        res.status(200).send('File updated successfully.');
    });
};

// Delete a file by ID
const deleteFileById = (req, res) => {
    const fileId = req.params.id;

    fileModel.deleteFileById(fileId, (err, result) => {
        if (err) return res.status(500).send(err);
        if (result === 0) return res.status(404).send('File not found.');
        res.status(200).send('File deleted successfully.');
    });
};

//getting all files
const getAllFiles = (req, res) => {
    fileModel.listFilesForUser(req.user.id, (err, files) => {
        if (err) return res.status(500).send(err);
        if (!files || files.length === 0) return res.status(404).send('No files found.');
        res.status(200).json(files);
    });
};


//view file by id
const viewFile = (req, res) => {
    const fileId = req.params.id;

    fileModel.getFileById(fileId, (err, file) => {
        if (err) return res.status(500).send(err);
        if (!file) return res.status(404).send('File not found.');

        // Render the view with file details
        res.render('view-file', { file });
    });
};


// List all files for a user
const listFilesForUser = (req, res) => {
    const userId = req.params.userId;

    fileModel.listFilesForUser(userId, (err, files) => {
        if (err) return res.status(500).send(err);
        res.render('manage-files', { files, userId }); // Pass the files to the EJS template
    });
};

// Render the manage files page
const renderManageFilesPage = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming the user is logged in and req.user is populated
        const files = await fileModel.listFilesForUser(userId);
        res.render('manage-files', { files });
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    upload,
    viewFile,
    getAllFiles,
    createFile,
    getFileById,
    updateFileById,
    deleteFileById,
    listFilesForUser,
    renderManageFilesPage // Export the new function
};

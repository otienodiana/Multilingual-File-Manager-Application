const multer = require('multer');
const path = require('path');
const fileModel = require('../models/fileModel');

// Set up multer storage
// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = uniqueSuffix + path.extname(file.originalname);
      cb(null, filename);
    }
  });
  
  const upload = multer({ storage: storage });
  
  
  
  


// Create a file entry
const createFile = (req, res) => {
    const file = req.file;
    const userId = req.user ? req.user.id : null; // Ensure req.user is set and extract user.id

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    if (!userId) {
        return res.status(400).send('User not authenticated.'); // Handle cases where user is not authenticated
    }

    const fileData = {
        user_id: userId,
        filename: file.originalname,
        filepath: file.path,
        size: file.size
    };

    fileModel.createFile(fileData, (err, result) => {
        if (err) return res.status(500).send(err);
        
        // Redirect to the user page after successful upload
        res.redirect('/manage-files');
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

    fileModel.updateFileById(fileId, (err, result) => {
        if (err) return res.status(500).send(err);
        if (result[0] === 0) return res.status(404).send('File not found.');
        res.status(200).send('File updated successfully.');
    });
};

// Delete a file by ID
const deleteFileById = (req, res) => {
    const fileId = req.params.id;

    fileModel.deleteFileById(fileId, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result === 0) {
            return res.status(404).send('File not found.');
        }
        
        // Redirect to the /manage-files page after successful delete
        res.redirect('/manage-files');
    });
};


// Getting all files
const getAllFiles = (req, res) => {
    fileModel.listFilesForUser(req.user.id, (err, files) => {
        if (err) return res.status(500).send(err);
        if (!files || files.length === 0) return res.status(404).send('No files found.');
        res.status(200).json(files);
    });
};

// View file by ID
const viewFileById = (req, res) => {
    const fileId = req.params.id;

    // Call the model method to get file details
    fileModel.getFileById(fileId, (err, file) => {
        if (err) {
            // Handle any errors that occur
            return res.status(500).send(err);
        }
        if (!file) {
            // Handle case where file is not found
            return res.status(404).send('File not found.');
        }

        // Render the view with the file details
        res.render('uploads/', { file });
    });
};


// List all files for a user
const listFilesForUser = (req, res) => {
    const userId = req.params.userId;

    fileModel.listFilesForUser(userId, (err, files) => {
        if (err) return res.status(500).send(err);
        res.render('manage-files', { files, userId, language: req.language }); // Pass the files and language to the EJS template
    });
};

// Render the manage files page
const renderManageFilesPage = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming the user is logged in and req.user is populated
        const files = await fileModel.listFilesForUser(userId);
        res.render('manage-files', { files, language: req.language }); // Pass the language to the EJS template
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    upload,
    viewFileById,
    getAllFiles,
    createFile,
    getFileById,
    updateFileById,
    deleteFileById,
    listFilesForUser,
    renderManageFilesPage // Export the new function
};

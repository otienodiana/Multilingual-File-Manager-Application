const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const File = sequelize.define('File', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filepath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  size: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'files',
  timestamps: false
});

// Function to create a file entry
const createFile = (fileData, callback) => {
  File.create(fileData)
    .then(file => callback(null, file))
    .catch(err => callback(err, null));
};

// Function to get a file by ID
const getFileById = (fileId, callback) => {
  File.findByPk(fileId)
    .then(file => callback(null, file))
    .catch(err => callback(err, null));
};

// Function to update a file by ID
const updateFileById = (fileId, fileData, callback) => {
  File.update(fileData, { where: { id: fileId } })
    .then(result => callback(null, result))
    .catch(err => callback(err, null));
};

//function for viewing a file
const viewFile = (req, res) => {
  const fileId = req.params.id;

  fileModel.getFileById(fileId, (err, file) => {
      if (err) return res.status(500).send(err);
      if (!file) return res.status(404).send('File not found.');

      // Render the view with file details
      res.render('view-file', { file });
  });
};


// Function to delete a file by ID
const deleteFileById = (fileId, callback) => {
  File.destroy({ where: { id: fileId } })
    .then(result => callback(null, result))
    .catch(err => callback(err, null));
};

// Function to list files for a user
const listFilesForUser = (userId, callback) => {
  File.findAll({ where: { user_id: userId } })
    .then(files => callback(null, files))
    .catch(err => callback(err, null));
};

module.exports = {
  viewFile,
  createFile,
  getFileById,
  updateFileById,
  deleteFileById,
  listFilesForUser
};

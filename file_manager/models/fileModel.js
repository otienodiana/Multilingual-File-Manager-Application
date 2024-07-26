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
  createFile,
  getFileById,
  updateFileById,
  deleteFileById,
  listFilesForUser
};

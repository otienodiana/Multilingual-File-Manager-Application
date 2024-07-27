require('dotenv').config();

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('filemanage_db', 'root', 'Alustudent2022!', {
  host: 'localhost',
  dialect: 'mysql'
});

// Test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;

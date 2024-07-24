// config/database.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'file_manager_user',
  password: 'Alustudent2022!',
  database: 'filemanage_db'
});

module.exports = pool.promise();

const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Alustudent2022!.,',
  database: 'filemanage_db'
});

pool.promise().query('SELECT 1')
  .then(([rows, fields]) => {
    console.log('Database connection successful:', rows);
  })
  .catch(err => {
    console.error('Database connection error:', err.message);
  });

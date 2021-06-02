const mysql = require('mysql2');

// crate the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'pauline',
    password: 'P4ul1n3.',
    database: 'groupomania'
/*    host: `${process.env.DB_HOST}`,
    user: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASS}`,
    database: `${process.env.DB_DATABASE}`*/
  });

module.exports = connection;
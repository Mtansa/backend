// db.js
const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hotel'
});

db.connect(err => {
    if (err) throw err;
    console.log('Conexion establecida');
});

module.exports = db;

const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'db_apikey_buah_sayur',
     port: 3309 
});

db.connect(err => {
    if (err) {
        console.error('Database gagal terhubung');
        return;
    }
    console.log('MySQL Connected');
});

module.exports = db;

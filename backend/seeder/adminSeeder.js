const bcrypt = require('bcryptjs');
const db = require('../config/db');

const nama = 'Admin';
const email = 'admin@gmail.com';
const password = 'admin123';

const hash = bcrypt.hashSync(password, 10);

db.query(
  'INSERT INTO users (nama, email, password, role) VALUES (?,?,?,?)',
  [nama, email, hash, 'admin'],
  (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('ADMIN BERHASIL DIBUAT');
      console.log('NAMA     : Admin');
      console.log('EMAIL    : admin@gmail.com');
      console.log('PASSWORD : admin123');
    }
    process.exit();
  }
);

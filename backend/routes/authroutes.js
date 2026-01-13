const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

/* REGISTER USER */
router.post('/register', (req, res) => {
    const { nama, email, password } = req.body;
    if (!nama || !email || !password) return res.status(400).json({ message: 'Data tidak lengkap' });

    const hash = bcrypt.hashSync(password, 10);
    db.query(
        'INSERT INTO users (nama, email, password) VALUES (?,?,?)',
        [nama, email, hash],
        (err) => {
            if (err) return res.status(500).json({ message: 'Register gagal' });
            res.json({ message: 'Register berhasil' });
        }
    );
});

/* LOGIN USER / ADMIN */
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email & password wajib diisi' });

    db.query('SELECT id, nama, email, password, role FROM users WHERE email=?', [email], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (result.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });

        const user = result[0];
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Password salah' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, nama: user.nama }, // ✅ nama user di JWT
            process.env.JWT_SECRET || 'SECRETKEY',
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login berhasil',
            token,
            role: user.role,
            nama: user.nama
        });
    });
});

/* LOGOUT USER / ADMIN */
router.post('/logout', (req, res) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        authMiddleware.revokeToken(token); // 🔥 revoke token
    }

    res.json({
        message: 'Logout berhasil'
    });
});

module.exports = router;

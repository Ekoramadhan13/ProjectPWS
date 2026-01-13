const express = require('express');
const db = require('../config/db');
const apiKey = require('../middleware/apiKey');

const router = express.Router();

/* GET SEMUA PRODUK */
router.get('/produk', apiKey, (req, res) => {
    db.query('SELECT * FROM produk', (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(result);
    });
});

/* SEARCH PRODUK */
router.get('/produk/search', apiKey, (req, res) => {
    const { nama, kategori } = req.query;
    let sql = 'SELECT * FROM produk WHERE 1=1';
    const params = [];

    if (nama) { sql += ' AND nama LIKE ?'; params.push(`%${nama}%`); }
    if (kategori) { sql += ' AND kategori = ?'; params.push(kategori); }

    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(result);
    });
});

module.exports = router;

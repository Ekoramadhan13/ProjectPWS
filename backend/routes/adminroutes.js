const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

/* CRUD PRODUK */
router.get('/produk', auth, admin, (req, res) => {
    db.query('SELECT * FROM produk', (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(result);
    });
});

router.post('/produk', auth, admin, (req, res) => {
    const { nama, kategori, harga, stok, foto } = req.body;
    db.query('INSERT INTO produk VALUES (NULL,?,?,?,?,?)', [nama, kategori, harga, stok, foto], (err) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ message: 'Produk ditambahkan' });
    });
});

router.put('/produk/:id', auth, admin, (req, res) => {
    const { nama, kategori, harga, stok, foto } = req.body;
    db.query('UPDATE produk SET nama=?, kategori=?, harga=?, stok=?, foto=? WHERE id=?', [nama, kategori, harga, stok, foto, req.params.id], (err) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ message: 'Produk diupdate' });
    });
});

router.delete('/produk/:id', auth, admin, (req, res) => {
    db.query('DELETE FROM produk WHERE id=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ message: 'Produk dihapus' });
    });
});

router.get('/produk/search', auth, admin, (req, res) => {
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

/* API KEY ADMIN */
router.get('/apikeys', auth, admin, (req, res) => {
    db.query(
        `SELECT ak.id, ak.api_key, ak.status, ak.limit_daily, ak.used_daily, u.nama
         FROM api_keys ak
         JOIN users u ON ak.user_id = u.id`,
        (err, result) => {
            if (err) return res.status(500).json({ message: err.message });
            res.json(result);
        }
    );
});

router.put('/apikeys/:id/nonaktif', auth, admin, (req, res) => {
    db.query('UPDATE api_keys SET status="nonaktif" WHERE id=?', [req.params.id], () => {
        res.json({ message: 'API Key nonaktif' });
    });
});

router.put('/apikeys/:id/aktif', auth, admin, (req, res) => {
    db.query('UPDATE api_keys SET status="aktif" WHERE id=?', [req.params.id], () => {
        res.json({ message: 'API Key aktif' });
    });
});

router.put('/apikeys/user/:userId/limit', auth, admin, (req, res) => {
    const { limit_daily } = req.body;
    const userId = req.params.userId;

    db.query(
        `UPDATE api_keys
         SET limit_daily = ?
         WHERE user_id = ? AND status = 'aktif'`,
        [limit_daily, userId],
        (err, result) => {
            if (err) return res.status(500).json({ message: err.message });
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'API Key aktif user tidak ditemukan'
                });
            }
            res.json({ message: 'Limit API Key user diupdate' });
        }
    );
});

router.get('/apikeys/:id/statistik', auth, admin, (req, res) => {
    db.query('SELECT api_key, limit_daily, used_daily, last_used FROM api_keys WHERE id=?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        if (result.length === 0) return res.status(404).json({ message: 'API Key tidak ditemukan' });
        res.json(result[0]);
    });
});

module.exports = router;

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/generate-apikey', auth, (req, res) => {

    // 🔐 PENGAMAN ROLE
    if (req.user.role !== 'user') {
        return res.status(403).json({
            message: 'Admin tidak boleh generate API Key'
        });
    }

    const userId = req.user.id;
    const apiKey = uuidv4();


  // 1. NONAKTIFKAN SEMUA API KEY USER INI
  db.query(
    'UPDATE api_keys SET status = "nonaktif" WHERE user_id = ?',
    [userId],
    (err) => {
      if (err) return res.status(500).json({ message: err.message });

      // 2. BUAT API KEY BARU
      db.query(
        `INSERT INTO api_keys (user_id, api_key, status, limit_daily, used_daily)
         VALUES (?, ?, "aktif", 100, 0)`,
        [userId, apiKey],
        (err2) => {
          if (err2) return res.status(500).json({ message: err2.message });

          res.json({
            message: 'API Key berhasil dibuat',
            api_key: apiKey
          });
        }
      );
    }
  );
});

/* LIHAT API KEY TERAKHIR */
router.get('/apikey', auth, (req, res) => {
  const userId = req.user.id;

  db.query(
    `SELECT ak.api_key, ak.status, ak.limit_daily, ak.used_daily, ak.last_used, u.nama
     FROM api_keys ak
     JOIN users u ON ak.user_id = u.id
     WHERE ak.user_id = ? AND ak.status = 'aktif'
     LIMIT 1`,
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (!result.length)
        return res.status(404).json({ message: 'API Key tidak ada' });

      res.json(result[0]);
    }
  );
});

module.exports = router;

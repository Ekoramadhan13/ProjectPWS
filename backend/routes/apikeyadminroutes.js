const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.get('/apikeys', auth, admin, (req, res) => {
  db.query(
    `SELECT 
        api_keys.id,
        users.nama,
        api_keys.api_key,
        api_keys.status,
        api_keys.limit_daily,
        api_keys.used_daily
     FROM api_keys 
     JOIN users ON api_keys.user_id = users.id`,
    (e, r) => {
      if (e) return res.status(500).json({ message: e.message });
      res.json(r); // ✅ ARRAY
    }
  );
});

router.put('/apikeys/:id/nonaktif', auth, admin, (req, res) => {
    db.query(
        'UPDATE api_keys SET status="nonaktif" WHERE id=?',
        [req.params.id],
        () => res.json({ message: 'API Key nonaktif' })
    );
});

router.put('/apikeys/:id/limit', auth, admin, (req, res) => {
  const { id } = req.params; // api_keys.id
  const { limit_daily } = req.body;

  if (limit_daily == null || limit_daily < 0) {
    return res.status(400).json({ message: 'Limit tidak valid' });
  }

  db.query(
    'UPDATE api_keys SET limit_daily = ? WHERE id = ?',
    [limit_daily, id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'API key tidak ditemukan' });
      }

      res.json({
        success: true,
        message: 'Limit API Key berhasil diupdate'
      });
    }
  );
});

module.exports = router;

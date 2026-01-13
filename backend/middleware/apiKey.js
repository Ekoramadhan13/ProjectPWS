const db = require('../config/db');

module.exports = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return res.status(401).json({ message: 'API Key tidak ada' });
    }

    db.query(
        `SELECT id, user_id, api_key, limit_daily, used_daily
         FROM api_keys
         WHERE api_key=? AND status="aktif"
         LIMIT 1`,
        [apiKey],
        (err, result) => {
            if (err) return res.status(500).json({ message: err.message });
            if (result.length === 0) {
                return res.status(403).json({ message: 'API Key tidak valid' });
            }

            const key = result[0];

            if (key.used_daily >= key.limit_daily) {
                return res.status(429).json({ message: 'Kuota harian habis' });
            }

            // ✅ Update kuota SATU KALI SAJA
            db.query(
                'UPDATE api_keys SET used_daily = used_daily + 1, last_used = NOW() WHERE id=?',
                [key.id],
                (err2) => {
                    if (err2) return res.status(500).json({ message: err2.message });

                    req.apiKey = key; // simpan OBJECT
                    next();
                }
            );
        }
    );
};

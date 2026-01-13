const jwt = require('jsonwebtoken');

// 🔐 In-memory revoked token (RAM)
const revokedTokens = new Set();

const auth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Token tidak ada' });
    }

    const token = authHeader.split(' ')[1];

    // ❌ Token sudah logout
    if (revokedTokens.has(token)) {
        return res.status(401).json({ message: 'Token sudah logout' });
    }

    jwt.verify(
        token,
        process.env.JWT_SECRET || 'SECRETKEY',
        (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Token tidak valid' });
            }

            req.user = user; // id, role, nama
            next();
        }
    );
};

// 🔓 helper untuk logout
auth.revokeToken = (token) => {
    revokedTokens.add(token);
};

module.exports = auth;

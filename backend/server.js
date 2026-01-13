const express = require('express');
const cors = require('cors');

// koneksi database (auto connect)
require('./config/db');

// import routes
const authRoutes = require('./routes/authroutes');
const adminRoutes = require('./routes/adminroutes');
const apiKeyAdminRoutes = require('./routes/apikeyadminroutes');
const userRoutes = require('./routes/userroutes');
const apiRoutes = require('./routes/apiroutes');

const app = express();

/* ================= MIDDLEWARE GLOBAL ================= */
app.use(cors());
app.use(express.json());

/* ================= ROUTES ================= */
app.use('/auth', authRoutes);          // login & register
app.use('/user', userRoutes);          // generate api key
app.use('/api', apiRoutes);            // api produk (pakai api key)
app.use('/admin', adminRoutes);         // admin CRUD produk
app.use('/admin', apiKeyAdminRoutes);   // admin ON/OFF api key

/* ================= ROOT ================= */
app.get('/', (req, res) => {
    res.send('API Key Buah & Sayur - Backend Running 🚀');
});

/* ================= SERVER ================= */
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});

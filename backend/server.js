const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDatabase = require('./config/database');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Connect to Database
connectDatabase();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*', credentials: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/reviews', require('./routes/review'));

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Mussawira API is running!',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth/login',
            contact: '/api/contact',
            gallery: '/api/gallery'
        }
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════╗
║   🚀 Server running on port ${PORT}      ║
║   📡 http://localhost:${PORT}            ║
╚═══════════════════════════════════════╝
    `);
});
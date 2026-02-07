const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
    const { username, password } = req.body;
    
    if (username === process.env.ADMIN_USERNAME && 
        password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign(
            { username, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.json({ success: true, token });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
};

exports.checkAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};
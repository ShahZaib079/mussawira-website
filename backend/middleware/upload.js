const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = '/tmp/uploads'; // Use /tmp on Vercel (serverless)

// Create directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'painting-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter - accept all images for now (we'll add WebP restriction later)
const fileFilter = (req, file, cb) => {
    console.log('📤 Uploaded file:', file.originalname);
    console.log('📋 MIME type:', file.mimetype);
    
    // Accept common image types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    
    if (!allowedTypes.includes(file.mimetype)) {
        console.log('❌ Rejected: Invalid file type');
        return cb(new Error('Only image files are allowed (JPEG, PNG, WebP, GIF)'), false);
    }
    
    console.log('✅ Accepted: Valid image');
    cb(null, true);
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: fileFilter
});

module.exports = upload;

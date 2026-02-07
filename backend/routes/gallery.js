const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { 
    getAllPaintings, 
    getPainting,
    createPainting, 
    updatePainting,
    deletePainting 
} = require('../controllers/galleryController');
const { checkAuth } = require('../middleware/auth');

// Public routes
router.get('/', getAllPaintings);
router.get('/:id', getPainting); // ADD THIS

// Admin routes
router.post('/', checkAuth, upload.single('image'), createPainting);
router.put('/:id', checkAuth, upload.single('image'), updatePainting);
router.delete('/:id', checkAuth, deletePainting);

module.exports = router;
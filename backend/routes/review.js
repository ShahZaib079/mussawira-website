const express = require('express');
const router = express.Router();
const { 
    createReview, 
    getApprovedReviews, 
    getAllReviews, 
    approveReview, 
    deleteReview 
} = require('../controllers/reviewController');
const { checkAuth } = require('../middleware/auth');

// Public routes
router.post('/', createReview);
router.get('/approved', getApprovedReviews);

// Admin routes
router.get('/', checkAuth, getAllReviews);
router.put('/:id/approve', checkAuth, approveReview);
router.delete('/:id', checkAuth, deleteReview);

module.exports = router;
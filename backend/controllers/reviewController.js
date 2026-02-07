const Review = require('../models/Review');

exports.createReview = async (req, res) => {
    try {
        console.log('⭐ Creating review:', req.body);
        
        const { customerName, customerEmail, rating, comment, paintingId } = req.body;
        
        // Validate rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
        }
        
        const review = await Review.create({
            customerName,
            customerEmail,
            rating,
            comment,
            paintingId: paintingId || null
        });
        
        console.log('✅ Review created:', review._id);
        
        res.status(201).json({
            success: true,
            message: 'Thank you for your review! It will be visible after approval.',
            data: review
        });
        
    } catch (error) {
        console.error('❌ Error creating review:', error);
        res.status(500).json({ success: false, message: 'Error submitting review', error: error.message });
    }
};

exports.getApprovedReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ approved: true })
            .sort({ createdAt: -1 })
            .populate('paintingId', 'title');
        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .sort({ createdAt: -1 })
            .populate('paintingId', 'title');
        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.approveReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { approved: true },
            { new: true }
        );
        res.json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
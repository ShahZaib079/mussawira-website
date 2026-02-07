const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    paintingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Painting' },
    approved: { type: Boolean, default: false }, // Admin must approve
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
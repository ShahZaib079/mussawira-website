const mongoose = require('mongoose');

const paintingSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { 
        type: String, 
        required: true,
        enum: ['portraits', 'landscapes', 'acrylic', 'crafts', 'croatia']
    },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    available: { type: Boolean, default: true },
    stock: { type: Number, default: 1 },
    featured: { type: Boolean, default: false },
    dimensions: { type: String }, // e.g., "24x36 inches"
    medium: { type: String }, // e.g., "Oil on Canvas"
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Painting', paintingSchema);
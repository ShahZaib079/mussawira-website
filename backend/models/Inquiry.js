const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', inquirySchema);
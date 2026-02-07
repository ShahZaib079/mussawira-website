const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    shippingAddress: { type: String, required: true },
    items: [{
        paintingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Painting' },
        title: String,
        price: Number,
        quantity: { type: Number, default: 1 }
    }],
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending' 
    },
    paymentMethod: { type: String, enum: ['cod', 'bank', 'jazzcash', 'easypaisa'] },
    notes: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
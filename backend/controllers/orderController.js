const Order = require('../models/Order');
const Painting = require('../models/Painting');

exports.createOrder = async (req, res) => {
    try {
        console.log('📦 Creating order:', req.body);
        
        const { customerName, customerEmail, customerPhone, shippingAddress, items, paymentMethod, notes } = req.body;
        
        // Calculate total
        let totalAmount = 0;
        const orderItems = [];
        
        for (let item of items) {
            const painting = await Painting.findById(item.paintingId);
            if (!painting) {
                return res.status(404).json({ success: false, message: `Painting not found: ${item.paintingId}` });
            }
            
            if (!painting.available) {
                return res.status(400).json({ success: false, message: `${painting.title} is no longer available` });
            }
            
            orderItems.push({
                paintingId: painting._id,
                title: painting.title,
                price: painting.price,
                quantity: item.quantity || 1
            });
            
            totalAmount += painting.price * (item.quantity || 1);
        }
        
        // Create order
        const order = await Order.create({
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress,
            items: orderItems,
            totalAmount,
            paymentMethod,
            notes
        });
        
        console.log('✅ Order created:', order._id);
        
        res.status(201).json({
            success: true,
            message: 'Order placed successfully! We will contact you soon.',
            data: order
        });
        
    } catch (error) {
        console.error('❌ Error creating order:', error);
        res.status(500).json({ success: false, message: 'Error placing order', error: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }).populate('items.paintingId');
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
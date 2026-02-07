const Inquiry = require('../models/Inquiry');

exports.submitInquiry = async (req, res) => {
    try {
        console.log('📨 Received inquiry data:', req.body);
        
        const { name, email, subject, message } = req.body;
        
        // Validate
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        
        // Create inquiry
        const inquiry = await Inquiry.create({
            name: name,
            email: email,
            subject: subject,
            message: message
        });
        
        console.log('✅ Inquiry saved:', inquiry._id);
        
        res.status(201).json({
            success: true,
            message: 'Thank you for your message! We will get back to you soon.',
            data: inquiry
        });
        
    } catch (error) {
        console.error('❌ Error submitting inquiry:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting inquiry',
            error: error.message
        });
    }
};

exports.getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        console.log(`📋 Retrieved ${inquiries.length} inquiries`);
        res.json({ success: true, data: inquiries });
    } catch (error) {
        console.error('❌ Error getting inquiries:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
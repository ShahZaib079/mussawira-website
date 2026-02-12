const Painting = require('../models/Painting');
const fs = require('fs').promises;

// Get all paintings
exports.getAllPaintings = async (req, res) => {
    try {
        const { category, featured } = req.query;
        
        let query = {};
        if (category && category !== 'all') {
            query.category = category;
        }
        if (featured === 'true') {
            query.featured = true;
        }

        const paintings = await Painting.find(query).sort({ createdAt: -1 });
        
        console.log(`📊 Retrieved ${paintings.length} paintings`);
        
        res.json({ success: true, count: paintings.length, data: paintings });
    } catch (error) {
        console.error('❌ Error getting paintings:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get single painting
exports.getPainting = async (req, res) => {
    try {
        const painting = await Painting.findById(req.params.id);
        if (!painting) {
            return res.status(404).json({ success: false, message: 'Painting not found' });
        }
        res.json({ success: true, data: painting });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Create painting with base64 image
exports.createPainting = async (req, res) => {
    try {
        console.log('📤 Create painting request received');
        console.log('Body:', req.body);
        console.log('File:', req.file ? req.file.filename : 'No file');
        
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload an image' });
        }
        
        // Read file and convert to base64
        const imageBuffer = await fs.readFile(req.file.path);
        const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;
        
        console.log('✅ Image converted to base64, length:', base64Image.length);
        
        // Delete temp file
        await fs.unlink(req.file.path).catch(err => console.log('Could not delete temp file:', err.message));
        
        const paintingData = {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            price: parseFloat(req.body.price),
            imageUrl: base64Image,
            available: req.body.available !== 'false',
            stock: parseInt(req.body.stock) || 1
        };
        
        const painting = await Painting.create(paintingData);
        
        console.log('✅ Painting created:', painting._id);
        
        res.status(201).json({ success: true, data: painting, message: 'Painting added successfully!' });
    } catch (error) {
        console.error('❌ Error creating painting:', error);
        if (req.file) {
            await fs.unlink(req.file.path).catch(console.error);
        }
        res.status(500).json({ success: false, message: 'Error adding painting', error: error.message });
    }
};

// Delete painting
exports.deletePainting = async (req, res) => {
    try {
        const painting = await Painting.findById(req.params.id);
        
        if (!painting) {
            return res.status(404).json({ success: false, message: 'Painting not found' });
        }
        
        await painting.deleteOne();
        
        console.log('✅ Painting deleted:', req.params.id);
        
        res.json({ success: true, message: 'Painting deleted successfully' });
    } catch (error) {
        console.error('❌ Error deleting painting:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
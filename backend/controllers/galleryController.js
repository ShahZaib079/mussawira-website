const Painting = require('../models/Painting');
const fs = require('fs').promises;
const path = require('path');

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
        res.json({ success: true, count: paintings.length, data: paintings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

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

exports.createPainting = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload an image' });
        }
        
        const paintingData = {
            ...req.body,
            imageUrl: `/uploads/${req.file.filename}`,
            stock: req.body.stock || 1,
            dimensions: req.body.dimensions || '',
            medium: req.body.medium || ''
        };
        
        const painting = await Painting.create(paintingData);
        
        res.status(201).json({ success: true, data: painting });
    } catch (error) {
        if (req.file) await fs.unlink(req.file.path).catch(console.error);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updatePainting = async (req, res) => {
    try {
        let painting = await Painting.findById(req.params.id);
        
        if (!painting) {
            return res.status(404).json({ success: false, message: 'Painting not found' });
        }
        
        // If new image uploaded
        if (req.file) {
            const oldImagePath = path.join(__dirname, '..', painting.imageUrl);
            await fs.unlink(oldImagePath).catch(console.error);
            req.body.imageUrl = `/uploads/${req.file.filename}`;
        }
        
        painting = await Painting.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        res.json({ success: true, data: painting });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deletePainting = async (req, res) => {
    try {
        const painting = await Painting.findById(req.params.id);
        if (!painting) {
            return res.status(404).json({ success: false, message: 'Not found' });
        }
        
        const imagePath = path.join(__dirname, '..', painting.imageUrl);
        await fs.unlink(imagePath).catch(console.error);
        await painting.deleteOne();
        
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
const express = require('express');
const router = express.Router();
const { submitInquiry, getAllInquiries } = require('../controllers/contactController');
const { checkAuth } = require('../middleware/auth');

router.post('/', submitInquiry);
router.get('/inquiries', checkAuth, getAllInquiries);

module.exports = router;
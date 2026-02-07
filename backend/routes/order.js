const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { checkAuth } = require('../middleware/auth');

router.post('/', createOrder);
router.get('/', checkAuth, getAllOrders);
router.put('/:id', checkAuth, updateOrderStatus);

module.exports = router;
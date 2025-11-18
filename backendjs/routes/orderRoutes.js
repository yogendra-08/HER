/**
 * Order Routes
 */

const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrdersByUser,
  getOrderById,
} = require('../controllers/orderController');

// Public routes
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/user/:email', getOrdersByUser); // Must be before /:id route
router.get('/:id', getOrderById);

module.exports = router;


/**
 * Order Controller
 * Handles order creation and retrieval
 */

const Order = require('../models/Order');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res) => {
  try {
    console.log('📝 Creating new order...');
    
    const { user_name, user_email, user_phone, location, products } = req.body;

    // Validation
    if (!user_name || !user_email || !user_phone || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide user name, email, phone, and location',
      });
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one product',
      });
    }

    // Calculate total amount
    const total_amount = products.reduce((sum, product) => {
      return sum + (product.product_price * (product.quantity || 1));
    }, 0);

    // Create order
    const order = await Order.create({
      user_name,
      user_email,
      user_phone,
      location,
      products,
      total_amount,
    });

    console.log(`✅ Order created successfully: ${order._id}`);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: {
        order: {
          id: order._id.toString(),
          _id: order._id.toString(),
          user_name: order.user_name,
          user_email: order.user_email,
          location: order.location,
          products: order.products,
          total_amount: order.total_amount,
          order_status: order.order_status,
          createdAt: order.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during order creation',
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public (should be protected in production)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: {
        orders: orders,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching orders',
    });
  }
};

// @desc    Get orders by user email
// @route   GET /api/orders/user/:email
// @access  Public (should be protected in production)
exports.getOrdersByUser = async (req, res) => {
  try {
    // Decode the email parameter (in case it's URL encoded)
    let email = req.params.email;
    try {
      email = decodeURIComponent(email);
    } catch (e) {
      // If decoding fails, use the original email
      console.log('Email decoding not needed or failed, using original');
    }
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'User email is required',
      });
    }

    // Normalize email to lowercase for consistent matching
    const normalizedEmail = email.toLowerCase().trim();
    console.log(`📦 Fetching orders for user email: ${normalizedEmail}`);

    const orders = await Order.find({ user_email: normalizedEmail }).sort({ createdAt: -1 });
    
    console.log(`✅ Found ${orders.length} orders for user: ${normalizedEmail}`);
    
    // Transform orders to ensure id field is always a string
    const transformedOrders = orders.map(order => ({
      ...order.toObject(),
      id: order._id.toString(),
      _id: order._id.toString(),
    }));
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: {
        orders: transformedOrders,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching user orders',
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public (should be protected in production)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        order: order,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching order',
    });
  }
};


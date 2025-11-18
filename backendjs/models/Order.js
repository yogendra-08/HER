/**
 * Order Model
 * Stores user orders with name, location, and product details
 */

const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    user_email: {
      type: String,
      required: [true, 'User email is required'],
      trim: true,
      lowercase: true,
    },
    user_phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location/Address is required'],
      trim: true,
    },
    products: [
      {
        product_id: {
          type: Number,
          required: true,
        },
        product_name: {
          type: String,
          required: true,
        },
        product_price: {
          type: Number,
          required: true,
        },
        product_image: {
          type: String,
          default: '',
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        collection: {
          type: String,
          enum: ['men', 'women'],
          required: true,
        },
      },
    ],
    total_amount: {
      type: Number,
      required: true,
      min: 0,
    },
    order_status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    payment_status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
OrderSchema.index({ user_email: 1 });
OrderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', OrderSchema);


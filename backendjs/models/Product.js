/**
 * Product Model
 * Matches the structure from mens_products.json
 */

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      default: 'VastraVerse',
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discounted_price: {
      type: Number,
      default: 0,
    },
    discount_percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    gender: {
      type: String,
      enum: ['Men', 'Women', 'Kids', 'Unisex'],
      default: 'Unisex',
    },
    age_group: {
      type: String,
      trim: true,
    },
    base_colour: {
      type: String,
      trim: true,
    },
    season: {
      type: String,
      trim: true,
    },
    usage: {
      type: String,
      trim: true,
    },
    fashion_type: {
      type: String,
      trim: true,
    },
    year: {
      type: String,
      trim: true,
    },
    display_categories: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    article_attributes: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    pattern: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    is_featured: {
      type: Boolean,
      default: false,
    },
    style_type: {
      type: String,
      trim: true,
    },
    variant_name: {
      type: String,
      trim: true,
    },
    color1: {
      type: String,
      default: 'NA',
    },
    color2: {
      type: String,
      default: 'NA',
    },
    article_number: {
      type: String,
      trim: true,
    },
    navigation_id: {
      type: Number,
      default: 0,
    },
    landing_page_url: {
      type: String,
      trim: true,
    },
    cross_links: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    stock: {
      type: Number,
      default: 10,
      min: 0,
    },
    sizes: {
      type: [String],
      default: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'products', // Default collection
  }
);

// Index for faster queries
ProductSchema.index({ gender: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ name: 'text', brand: 'text', category: 'text' });

module.exports = mongoose.model('Product', ProductSchema);


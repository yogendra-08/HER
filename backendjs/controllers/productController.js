/**
 * Product Controller
 * Fetches products directly from MongoDB collections (men, women)
 */

const mongoose = require('mongoose');

// Get collection directly (no model needed)
const getCollection = (collectionName) => {
  return mongoose.connection.db.collection(collectionName);
};

// @desc    Get all products from men collection
// @route   GET /api/products/men
// @access  Public
exports.getMenProducts = async (req, res) => {
  try {
    console.log('📦 Fetching men products from MongoDB...');
    const menCollection = getCollection('men');
    const products = await menCollection.find({}).toArray();
    
    console.log(`✅ Found ${products.length} men products`);
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: {
        products: products,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching men products:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching men products',
    });
  }
};

// @desc    Get all products from women collection
// @route   GET /api/products/women
// @access  Public
exports.getWomenProducts = async (req, res) => {
  try {
    console.log('📦 Fetching women products from MongoDB...');
    const womenCollection = getCollection('women');
    const products = await womenCollection.find({}).toArray();
    
    console.log(`✅ Found ${products.length} women products`);
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: {
        products: products,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching women products:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching women products',
    });
  }
};

// @desc    Get product by ID from men or women collection
// @route   GET /api/products/:collection/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const { collection, id } = req.params;
    
    if (!['men', 'women'].includes(collection)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid collection. Use "men" or "women"',
      });
    }
    
    const productCollection = getCollection(collection);
    const product = await productCollection.findOne({ id: parseInt(id) });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        product: product,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching product',
    });
  }
};

// @desc    Search products in men or women collection
// @route   GET /api/products/:collection/search
// @access  Public
exports.searchProducts = async (req, res) => {
  try {
    const { collection } = req.params;
    const { q } = req.query;
    
    if (!['men', 'women'].includes(collection)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid collection. Use "men" or "women"',
      });
    }
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query',
      });
    }
    
    const productCollection = getCollection(collection);
    const searchRegex = new RegExp(q, 'i');
    
    const products = await productCollection.find({
      $or: [
        { name: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
        { description: searchRegex },
      ],
    }).toArray();
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: {
        products: products,
      },
    });
  } catch (error) {
    console.error('❌ Error searching products:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while searching products',
    });
  }
};


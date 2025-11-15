/**
 * Product Routes for VastraVerse
 * Handles product-related endpoints
 */

import { Router } from 'express';
import { 
  getAllProducts, 
  getProductsByCategory, 
  getProduct, 
  searchProducts,
  createProduct,
  updateProduct,
  deleteAllProducts
} from '../controllers/productController';
import { 
  getAllProducts as getAllProductsJSON,
  getProductById as getProductByIdJSON
} from '../controllers/jsonProductController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// JSON-based routes (for placeholder data)
// Use these routes when you want to serve from JSON file
router.get('/json', getAllProductsJSON);
router.get('/json/:id', getProductByIdJSON);

// Database-based routes (existing)
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);

// Protected routes (Admin only - optional)
router.post('/', authenticateToken, createProduct);
router.put('/:id', authenticateToken, updateProduct);
router.delete('/all', authenticateToken, deleteAllProducts);

export default router;

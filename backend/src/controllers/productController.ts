/**
 * Product Controller for VastraVerse
 * Handles product-related operations
 */

import { Request, Response } from 'express';
import { ProductModel, Product } from '../models/productModel';

// Get all products
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await ProductModel.findAll();
    
    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get products by category
export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;
    
    if (!category) {
      res.status(400).json({
        success: false,
        message: 'Category is required'
      });
      return;
    }

    const products = await ProductModel.findByCategory(category);
    
    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get single product
export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = parseInt(req.params.id);
    
    if (isNaN(productId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
      return;
    }

    const product = await ProductModel.findById(productId);
    
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Search products
export const searchProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
      return;
    }

    const products = await ProductModel.search(q);
    
    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create product (Admin only - optional feature)
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    // Validation
    if (!name || !description || !price || !category || !image) {
      res.status(400).json({
        success: false,
        message: 'Name, description, price, category, and image are required'
      });
      return;
    }

    if (price <= 0) {
      res.status(400).json({
        success: false,
        message: 'Price must be greater than 0'
      });
      return;
    }

    const product = await ProductModel.create({
      name,
      description,
      price: parseFloat(price),
      category,
      image,
      stock: parseInt(stock) || 0,
      rating: 0,
      sizes: []
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update product (Admin only - optional feature)
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = parseInt(req.params.id);
    
    if (isNaN(productId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
      return;
    }

    const { name, description, price, category, image, stock } = req.body;
    
    const updateData: any = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = parseFloat(price);
    if (category) updateData.category = category;
    if (image) updateData.image = image;
    if (stock !== undefined) updateData.stock = parseInt(stock);

    const updated = await ProductModel.update(productId, updateData);
    
    if (!updated) {
      res.status(404).json({
        success: false,
        message: 'Product not found or no changes made'
      });
      return;
    }

    const product = await ProductModel.findById(productId);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete all products (Admin only)
export const deleteAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await ProductModel.deleteAll();
    
    if (!deleted) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete all products'
      });
      return;
    }

    res.json({
      success: true,
      message: 'All products deleted successfully'
    });
  } catch (error) {
    console.error('Delete all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

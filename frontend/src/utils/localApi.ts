/**
 * Local API Utility Functions for VastraVerse Frontend
 * Uses local JSON files instead of backend API
 */

import { LocalProductService } from '../services/localProductService';
import { Product, ApiResponse } from './api';

// Local Products API that mimics the backend API structure
export const localProductsAPI = {
  getAll: async (): Promise<ApiResponse<{ products: Product[] }>> => {
    try {
      const products = await LocalProductService.getAllProducts();
      return {
        success: true,
        data: { products }
      };
    } catch (error) {
      console.error('Error fetching all products locally:', error);
      return {
        success: false,
        message: 'Failed to load products from local files',
        data: { products: [] }
      };
    }
  },

  getById: async (id: number): Promise<ApiResponse<{ product: Product }>> => {
    try {
      const product = await LocalProductService.getProductById(id);
      if (!product) {
        return {
          success: false,
          message: 'Product not found'
        };
      }
      return {
        success: true,
        data: { product }
      };
    } catch (error) {
      console.error('Error fetching product by ID locally:', error);
      return {
        success: false,
        message: 'Failed to load product from local files'
      };
    }
  },

  // JSON-based endpoints (for placeholder data)
  getAllJSON: async (): Promise<ApiResponse<{ products: Product[] }>> => {
    return localProductsAPI.getAll();
  },

  getByIdJSON: async (id: number): Promise<ApiResponse<{ product: Product }>> => {
    return localProductsAPI.getById(id);
  },

  getByCategory: async (category: string): Promise<ApiResponse<{ products: Product[] }>> => {
    try {
      const products = await LocalProductService.getProductsByCategory(category);
      return {
        success: true,
        data: { products }
      };
    } catch (error) {
      console.error('Error fetching products by category locally:', error);
      return {
        success: false,
        message: 'Failed to load products from local files',
        data: { products: [] }
      };
    }
  },

  search: async (query: string): Promise<ApiResponse<{ products: Product[] }>> => {
    try {
      const products = await LocalProductService.searchProducts(query);
      return {
        success: true,
        data: { products }
      };
    } catch (error) {
      console.error('Error searching products locally:', error);
      return {
        success: false,
        message: 'Failed to search products from local files',
        data: { products: [] }
      };
    }
  },

  // Category-specific methods
  getMens: async (): Promise<ApiResponse<{ products: Product[] }>> => {
    try {
      const products = await LocalProductService.getMensProducts();
      return {
        success: true,
        data: { products }
      };
    } catch (error) {
      console.error('Error fetching men\'s products locally:', error);
      return {
        success: false,
        message: 'Failed to load men\'s products from local files',
        data: { products: [] }
      };
    }
  },

  getWomens: async (): Promise<ApiResponse<{ products: Product[] }>> => {
    try {
      const products = await LocalProductService.getWomensProducts();
      return {
        success: true,
        data: { products }
      };
    } catch (error) {
      console.error('Error fetching women\'s products locally:', error);
      return {
        success: false,
        message: 'Failed to load women\'s products from local files',
        data: { products: [] }
      };
    }
  },

  getKids: async (): Promise<ApiResponse<{ products: Product[] }>> => {
    try {
      const products = await LocalProductService.getKidsProducts();
      return {
        success: true,
        data: { products }
      };
    } catch (error) {
      console.error('Error fetching kids products locally:', error);
      return {
        success: false,
        message: 'Failed to load kids products from local files',
        data: { products: [] }
      };
    }
  },

  // Admin functions (for compatibility)
  create: async (): Promise<ApiResponse<{ product: Product }>> => {
    return {
      success: false,
      message: 'Product creation not supported in local mode'
    };
  },

  update: async (): Promise<ApiResponse<{ product: Product }>> => {
    return {
      success: false,
      message: 'Product updates not supported in local mode'
    };
  },

  deleteAll: async (): Promise<ApiResponse> => {
    return {
      success: true,
      message: 'All products cleared from local storage (simulated)'
    };
  }
};

// Export a flag to indicate we're using local data
export const isUsingLocalData = true;

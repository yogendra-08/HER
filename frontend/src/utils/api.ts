/**
 * API Utility Functions for VastraVerse Frontend
 * Handles all HTTP requests to the backend API
 */

import axios from 'axios';
import toast from 'react-hot-toast';

// API Base URL - For Netlify Functions or Direct Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.DEV 
    ? 'http://localhost:5000/api' // Direct backend server in development
    : '/.netlify/functions'
);

// Log API configuration in development
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:', {
    API_BASE_URL,
    VITE_API_URL: import.meta.env.VITE_API_URL,
    isDev: import.meta.env.DEV
  });
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vastraverse_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log detailed error information in development
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        message: error.message,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        fullURL: `${error.config?.baseURL}${error.config?.url}`,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        code: error.code,
      });
    }

    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      const message = 'Cannot connect to backend server. Make sure the backend is running on http://localhost:5000';
      console.error('❌ Connection Error:', message);
      toast.error(message);
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('vastraverse_token');
      localStorage.removeItem('vastraverse_user');
      window.location.href = '/login';
    }
    
    // Show error toast
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    toast.error(message);
    
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductColor {
  name: string;
  hex: string;
  image: string;
}

export interface ProductReview {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: number;
  title?: string; // DummyJSON uses 'title'
  name?: string; // For database products
  brand: string;
  description: string;
  price: number;
  discount?: number;
  discountPercentage?: number; // DummyJSON field
  category?: string;
  image?: string;
  thumbnail?: string; // DummyJSON field
  images?: string[]; // DummyJSON field
  imageBack?: string;
  stock: number;
  rating: number;
  sizes?: string[];
  colors?: ProductColor[];
  materials?: string;
  careInstructions?: string;
  reviews?: ProductReview[];
  related?: number[];
  created_at?: string;
  updated_at?: string;
  tags?: string[]; // DummyJSON field
  gender?: string; // For filtering by gender
}

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at?: string;
  product_name: string;
  product_price: number;
  product_image: string;
  product_stock: number;
}

export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  created_at?: string;
  product_name: string;
  product_price: number;
  product_image: string;
  product_description: string;
  product_stock: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

// Auth API
export const authAPI = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
  }): Promise<ApiResponse<{ token: string; user: User }>> => {
    console.log('🔵 Frontend: Registering user...', { url: `${API_BASE_URL}/auth/register`, data: { ...userData, password: '***' } });
    const response = await api.post('/auth/register', userData);
    console.log('✅ Frontend: Register response received', response.data);
    return response.data;
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ token: string; user: User }>> => {
    console.log('🔵 Frontend: Logging in...', { url: `${API_BASE_URL}/auth/login`, email: credentials.email });
    const response = await api.post('/auth/login', credentials);
    console.log('✅ Frontend: Login response received', response.data);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (userData: {
    name: string;
    phone?: string;
    address?: string;
  }): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },
};

// Products API
export const productsAPI = {
  getAll: async (): Promise<ApiResponse<{ products: Product[] }>> => {
    const response = await api.get('/products');
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<{ product: Product }>> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // JSON-based endpoints (for placeholder data)
  getAllJSON: async (): Promise<ApiResponse<{ products: Product[] }>> => {
    const response = await api.get('/products/json');
    return response.data;
  },

  getByIdJSON: async (id: number): Promise<ApiResponse<{ product: Product }>> => {
    const response = await api.get(`/products/json/${id}`);
    return response.data;
  },

  getByCategory: async (category: string): Promise<ApiResponse<{ products: Product[] }>> => {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  },

  search: async (query: string): Promise<ApiResponse<{ products: Product[] }>> => {
    const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  create: async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<{ product: Product }>> => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  update: async (id: number, productData: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>): Promise<ApiResponse<{ product: Product }>> => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteAll: async (): Promise<ApiResponse> => {
    const response = await api.delete('/products/all');
    return response.data;
  },
};

// Cart API
export const cartAPI = {
  get: async (): Promise<ApiResponse<{ items: CartItem[]; total: { totalItems: number; totalPrice: number } }>> => {
    const response = await api.get('/cart');
    return response.data;
  },

  add: async (productId: number, quantity: number = 1): Promise<ApiResponse<{ total: { totalItems: number; totalPrice: number } }>> => {
    const response = await api.post('/cart/add', { productId, quantity });
    return response.data;
  },

  update: async (productId: number, quantity: number): Promise<ApiResponse<{ total: { totalItems: number; totalPrice: number } }>> => {
    const response = await api.put('/cart/update', { productId, quantity });
    return response.data;
  },

  remove: async (productId: number): Promise<ApiResponse<{ total: { totalItems: number; totalPrice: number } }>> => {
    const response = await api.delete(`/cart/remove/${productId}`);
    return response.data;
  },

  clear: async (): Promise<ApiResponse> => {
    const response = await api.delete('/cart/clear');
    return response.data;
  },
};

// Wishlist API
export const wishlistAPI = {
  get: async (): Promise<ApiResponse<{ items: WishlistItem[]; count: number }>> => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  add: async (productId: number): Promise<ApiResponse<{ count: number }>> => {
    const response = await api.post('/wishlist/add', { productId });
    return response.data;
  },

  remove: async (productId: number): Promise<ApiResponse<{ count: number }>> => {
    const response = await api.delete(`/wishlist/remove/${productId}`);
    return response.data;
  },

  moveToCart: async (productId: number): Promise<ApiResponse<{ count: number }>> => {
    const response = await api.post(`/wishlist/move-to-cart/${productId}`);
    return response.data;
  },

  clear: async (): Promise<ApiResponse> => {
    const response = await api.delete('/wishlist/clear');
    return response.data;
  },
};

// Utility functions
export const setAuthToken = (token: string) => {
  localStorage.setItem('vastraverse_token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('vastraverse_token');
  localStorage.removeItem('vastraverse_user');
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('vastraverse_token');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export default api;

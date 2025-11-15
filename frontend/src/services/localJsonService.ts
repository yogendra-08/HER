/**
 * Local JSON Product Service
 * Fetches products from local JSON files in the public directory
 */

import { Product } from '../utils/api';

/**
 * Fetch products from a local JSON file
 */
const fetchLocalJson = async (filename: string): Promise<Product[]> => {
  try {
    const response = await fetch(`/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${filename}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle different JSON structures
    let products: any[] = [];
    
    if (Array.isArray(data)) {
      // If JSON is directly an array
      products = data;
    } else if (data.products && Array.isArray(data.products)) {
      // If JSON has a products property
      products = data.products;
    } else if (data.data && Array.isArray(data.data)) {
      // If JSON has a data property
      products = data.data;
    } else {
      console.warn(`Unexpected JSON structure in ${filename}:`, data);
      return [];
    }
    
    // Normalize products to match our Product interface
    return products.map((item: any, index: number) => normalizeProduct(item, index));
  } catch (error) {
    console.error(`Error fetching ${filename}:`, error);
    return [];
  }
};

/**
 * Normalize product data to match Product interface
 */
const normalizeProduct = (item: any, fallbackId: number): Product => {
  // Handle the actual structure from mens_products.json, womens_products.json, kids_products.json
  const price = item.discounted_price || item.price || 0;
  const originalPrice = item.price || item.discounted_price || 0;
  const discountPercentage = item.discount_percentage || item.discountPercentage || 0;
  
  return {
    id: item.id || item.product_id || fallbackId,
    title: item.name || item.title || item.product_name || 'Product',
    name: item.name || item.title || item.product_name || 'Product',
    brand: item.brand || 'VastraVerse',
    description: item.description || item.desc || `${item.brand || 'VastraVerse'} ${item.name || item.title || 'Product'}`,
    price: price,
    discountPercentage: discountPercentage,
    category: item.category || item.display_categories || 'Uncategorized',
    image: item.image || item.thumbnail || item.img || item.image_url || '/api/placeholder/300/400',
    thumbnail: item.image || item.thumbnail || item.img || item.image_url || '/api/placeholder/300/400',
    images: item.images || (item.image ? [item.image] : []) || ['/api/placeholder/300/400'],
    stock: item.stock || item.stock_quantity || Math.floor(Math.random() * 50) + 10,
    rating: item.rating || item.rating_score || 4.0 + Math.random() * 1.0,
    sizes: item.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    gender: (item.gender || '').toLowerCase() || getGenderFromFilename(item),
    tags: item.tags || [item.category, item.brand, item.display_categories].filter(Boolean),
    discount: discountPercentage > 0 ? Math.round(originalPrice * (discountPercentage / 100)) : 0
  };
};

/**
 * Determine gender from product data or filename
 */
const getGenderFromFilename = (item: any): string => {
  if (item.gender) return item.gender.toLowerCase();
  if (item.category?.toLowerCase().includes('men') || item.category?.toLowerCase().includes('mens')) return 'men';
  if (item.category?.toLowerCase().includes('women') || item.category?.toLowerCase().includes('womens')) return 'women';
  if (item.category?.toLowerCase().includes('kid') || item.category?.toLowerCase().includes('kids')) return 'kids';
  return 'unisex';
};

/**
 * Get men's products from mens_products.json
 */
export const getMensProducts = async (): Promise<Product[]> => {
  return fetchLocalJson('mens_products.json');
};

/**
 * Get women's products from womens_products.json
 */
export const getWomensProducts = async (): Promise<Product[]> => {
  return fetchLocalJson('womens_products.json');
};

/**
 * Get kids products from kids_products.json
 */
export const getKidsProducts = async (): Promise<Product[]> => {
  return fetchLocalJson('kids_products.json');
};

/**
 * Get all products from all JSON files
 */
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const [mens, womens, kids] = await Promise.all([
      getMensProducts(),
      getWomensProducts(),
      getKidsProducts()
    ]);
    
    return [...mens, ...womens, ...kids];
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
};

/**
 * Get product by ID from all JSON files
 */
export const getProductById = async (id: number): Promise<Product | null> => {
  const allProducts = await getAllProducts();
  return allProducts.find(p => p.id === id) || null;
};

/**
 * Search products across all JSON files
 */
export const searchProducts = async (query: string): Promise<Product[]> => {
  const allProducts = await getAllProducts();
  const queryLower = query.toLowerCase();
  
  return allProducts.filter(product =>
    product.name?.toLowerCase().includes(queryLower) ||
    product.title?.toLowerCase().includes(queryLower) ||
    product.description?.toLowerCase().includes(queryLower) ||
    product.brand?.toLowerCase().includes(queryLower) ||
    product.category?.toLowerCase().includes(queryLower) ||
    product.tags?.some(tag => tag.toLowerCase().includes(queryLower))
  );
};


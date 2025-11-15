/**
 * Local Product Service
 * Fetches product data from local JSON files in the public directory
 */

import { Product } from '../utils/api';

export interface LocalProduct {
  id: number;
  name: string;
  brand: string;
  price: number;
  discounted_price: number;
  discount_percentage: number;
  gender: string;
  age_group: string;
  base_colour: string;
  season: string;
  usage: string;
  fashion_type: string;
  year: string;
  display_categories: string;
  category: string;
  article_attributes: Record<string, any>;
  image?: string;
  images?: string[];
}

export interface LocalProductResponse {
  products: LocalProduct[];
}

// Convert local product format to API product format
const convertLocalToApiProduct = (localProduct: LocalProduct): Product => {
  return {
    id: localProduct.id,
    title: localProduct.name,
    name: localProduct.name,
    description: `${localProduct.brand} ${localProduct.name}`,
    category: localProduct.category,
    price: localProduct.discounted_price || localProduct.price,
    discountPercentage: localProduct.discount_percentage,
    rating: 4 + Math.random(), // Random rating between 4-5
    stock: Math.floor(Math.random() * 50) + 10, // Random stock 10-60
    brand: localProduct.brand,
    thumbnail: localProduct.image || '/api/placeholder/300/400',
    images: localProduct.images || [localProduct.image || '/api/placeholder/300/400'],
    image: localProduct.image || '/api/placeholder/300/400',
    tags: [localProduct.category, localProduct.brand, localProduct.gender],
    sizes: ['XS', 'S', 'M', 'L', 'XL'], // Default sizes
    gender: localProduct.gender,
    colors: [
      { 
        name: localProduct.base_colour, 
        hex: getColorHex(localProduct.base_colour),
        image: localProduct.image || '/api/placeholder/300/400'
      }
    ],
    related: [] // Will be populated separately
  };
};

// Get hex color for common color names
const getColorHex = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    'Black': '#000000',
    'White': '#FFFFFF',
    'Red': '#FF0000',
    'Blue': '#0000FF',
    'Green': '#008000',
    'Yellow': '#FFFF00',
    'Pink': '#FFC0CB',
    'Purple': '#800080',
    'Orange': '#FFA500',
    'Brown': '#A52A2A',
    'Grey': '#808080',
    'Gray': '#808080',
    'Navy': '#000080',
    'Maroon': '#800000',
    'Olive': '#808000',
    'Lime': '#00FF00',
    'Aqua': '#00FFFF',
    'Teal': '#008080',
    'Silver': '#C0C0C0',
    'Fuchsia': '#FF00FF'
  };
  
  return colorMap[colorName] || '#000000';
};

export class LocalProductService {
  private static async fetchJsonFile(filename: string): Promise<LocalProductResponse> {
    try {
      const response = await fetch(`/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${filename}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${filename}:`, error);
      return { products: [] };
    }
  }

  // Get all products from all JSON files
  static async getAllProducts(): Promise<Product[]> {
    try {
      const [mensData, womensData, kidsData] = await Promise.all([
        this.fetchJsonFile('mens_products.json'),
        this.fetchJsonFile('womens_products.json'),
        this.fetchJsonFile('kids_products.json')
      ]);

      const allLocalProducts = [
        ...mensData.products,
        ...womensData.products,
        ...kidsData.products
      ];

      return allLocalProducts.map(convertLocalToApiProduct);
    } catch (error) {
      console.error('Error fetching all products:', error);
      return [];
    }
  }

  // Get products by category/gender
  static async getProductsByCategory(category: string): Promise<Product[]> {
    const allProducts = await this.getAllProducts();
    
    const categoryLower = category.toLowerCase();
    return allProducts.filter(product => 
      product.gender?.toLowerCase().includes(categoryLower) ||
      product.category?.toLowerCase().includes(categoryLower) ||
      product.tags?.some(tag => tag.toLowerCase().includes(categoryLower))
    );
  }

  // Get product by ID
  static async getProductById(id: number): Promise<Product | null> {
    const allProducts = await this.getAllProducts();
    return allProducts.find(product => product.id === id) || null;
  }

  // Search products
  static async searchProducts(query: string): Promise<Product[]> {
    const allProducts = await this.getAllProducts();
    const queryLower = query.toLowerCase();
    
    return allProducts.filter(product =>
      product.name?.toLowerCase().includes(queryLower) ||
      product.title?.toLowerCase().includes(queryLower) ||
      product.description?.toLowerCase().includes(queryLower) ||
      product.brand?.toLowerCase().includes(queryLower) ||
      product.category?.toLowerCase().includes(queryLower) ||
      product.tags?.some(tag => tag.toLowerCase().includes(queryLower))
    );
  }

  // Get men's products
  static async getMensProducts(): Promise<Product[]> {
    const mensData = await this.fetchJsonFile('mens_products.json');
    return mensData.products.map(convertLocalToApiProduct);
  }

  // Get women's products
  static async getWomensProducts(): Promise<Product[]> {
    const womensData = await this.fetchJsonFile('womens_products.json');
    return womensData.products.map(convertLocalToApiProduct);
  }

  // Get kids products
  static async getKidsProducts(): Promise<Product[]> {
    const kidsData = await this.fetchJsonFile('kids_products.json');
    return kidsData.products.map(convertLocalToApiProduct);
  }
}

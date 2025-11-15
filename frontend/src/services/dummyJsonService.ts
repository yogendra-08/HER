/**
 * DummyJSON Product Service
 * Fetches 1000+ products from DummyJSON API with localStorage caching
 */

import { Product } from '../utils/api';

const DUMMYJSON_BASE_URL = 'https://dummyjson.com/products';
const CACHE_KEY = 'vastraverse_dummyjson_products';
const CACHE_TIMESTAMP_KEY = 'vastraverse_dummyjson_cache_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface DummyJSONProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface DummyJSONResponse {
  products: DummyJSONProduct[];
  total: number;
  skip: number;
  limit: number;
}

// Category mapping for DummyJSON to our categories
const CATEGORY_MAPPING: Record<string, string[]> = {
  'mens': [
    'mens-shirts',
    'mens-shoes',
    'mens-watches',
    'sunglasses',
    'fragrances',
    'automotive',
    'motorcycle',
    'lighting'
  ],
  'womens': [
    'womens-dresses',
    'womens-shoes',
    'womens-watches',
    'womens-bags',
    'womens-jewellery',
    'fragrances',
    'skincare',
    'home-decoration',
    'furniture'
  ],
  'kids': [
    'tops',
    'smartphones',
    'laptops',
    'tablets',
    'groceries',
    'home-decoration'
  ],
  'traditional': [
    'womens-dresses',
    'mens-shirts',
    'home-decoration',
    'furniture'
  ],
  'genz': [
    'smartphones',
    'laptops',
    'tablets',
    'womens-dresses',
    'mens-shirts',
    'sunglasses',
    'womens-bags',
    'womens-jewellery',
    'fragrances'
  ]
};

/**
 * Normalize DummyJSON product to our Product interface
 */
const normalizeProduct = (p: DummyJSONProduct, category?: string): Product => {
  return {
    id: p.id,
    title: p.title,
    name: p.title,
    brand: p.brand || 'VastraVerse',
    description: p.description,
    price: p.price,
    discountPercentage: p.discountPercentage || 0,
    category: category || p.category,
    image: p.thumbnail || (p.images && p.images[0]) || '',
    thumbnail: p.thumbnail || '',
    images: p.images || [p.thumbnail || ''],
    stock: p.stock || Math.floor(Math.random() * 50) + 10,
    rating: p.rating || 4.0 + Math.random(),
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    gender: getGenderFromCategory(p.category),
    tags: [p.category, p.brand],
    discount: p.discountPercentage ? Math.round(p.price * (p.discountPercentage / 100)) : 0
  };
};

/**
 * Determine gender from category
 */
const getGenderFromCategory = (category: string): string => {
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes('mens') || categoryLower.includes('men')) return 'men';
  if (categoryLower.includes('womens') || categoryLower.includes('women')) return 'women';
  if (categoryLower.includes('kids') || categoryLower.includes('kid')) return 'kids';
  return 'unisex';
};

/**
 * Fetch products from DummyJSON API with pagination and retry logic
 */
const fetchProductsFromAPI = async (limit: number = 100, skip: number = 0, retries: number = 3): Promise<Product[]> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const url = `${DUMMYJSON_BASE_URL}?limit=${limit}&skip=${skip}`;
      console.log(`Fetching products: limit=${limit}, skip=${skip}, attempt=${attempt}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: DummyJSONResponse = await response.json();
      
      if (!data.products || data.products.length === 0) {
        console.warn(`No products returned for skip=${skip}`);
        return [];
      }
      
      return data.products.map(p => normalizeProduct(p));
    } catch (error: any) {
      console.error(`Error fetching products (attempt ${attempt}/${retries}):`, error);
      
      if (attempt === retries) {
        // Last attempt failed
        if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
          throw new Error('Network error: Unable to connect to DummyJSON API. Please check your internet connection.');
        }
        if (error.message?.includes('CORS')) {
          throw new Error('CORS error: API access blocked. Please try again later.');
        }
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  return [];
};

/**
 * Fetch multiple pages to get 1000+ products
 */
const fetchAllProducts = async (): Promise<Product[]> => {
  const productsPerPage = 100;
  const totalPages = 12; // 12 pages * 100 = 1200 products
  const allProducts: Product[] = [];

  try {
    // Try fetching all pages in parallel first
    console.log('🌐 Starting to fetch products from DummyJSON API...');
    const fetchPromises = Array.from({ length: totalPages }, (_, i) =>
      fetchProductsFromAPI(productsPerPage, i * productsPerPage).catch(err => {
        console.warn(`Failed to fetch page ${i + 1}:`, err);
        return []; // Return empty array for failed pages
      })
    );

    const results = await Promise.allSettled(fetchPromises);
    
    // Process successful results
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allProducts.push(...result.value);
      } else {
        console.warn(`Page ${index + 1} failed:`, result.reason);
      }
    });

    // If we got some products but not enough, try sequential fetching for failed pages
    if (allProducts.length < 100 && totalPages > 0) {
      console.log(`⚠️ Only got ${allProducts.length} products, trying sequential fetch...`);
      
      // Try fetching fewer pages sequentially
      for (let i = 0; i < Math.min(5, totalPages); i++) {
        try {
          const products = await fetchProductsFromAPI(productsPerPage, i * productsPerPage);
          if (products.length > 0) {
            // Avoid duplicates
            const newProducts = products.filter(p => !allProducts.some(existing => existing.id === p.id));
            allProducts.push(...newProducts);
          }
          // Small delay between requests to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (err) {
          console.warn(`Sequential fetch failed for page ${i + 1}:`, err);
        }
      }
    }

    if (allProducts.length === 0) {
      throw new Error('No products could be fetched from the API. Please check your internet connection and try again.');
    }

    console.log(`✅ Fetched ${allProducts.length} products from DummyJSON API`);
    return allProducts;
  } catch (error: any) {
    console.error('Error fetching all products:', error);
    throw error; // Re-throw to let caller handle it
  }
};

/**
 * Get cached products from localStorage
 */
const getCachedProducts = (): Product[] | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    
    if (!cached || !timestamp) return null;
    
    const cacheAge = Date.now() - parseInt(timestamp, 10);
    if (cacheAge > CACHE_DURATION) {
      // Cache expired
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      return null;
    }
    
    return JSON.parse(cached);
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
};

/**
 * Cache products in localStorage
 */
const cacheProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(products));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error caching products:', error);
  }
};

/**
 * Get all products (from cache or API)
 */
export const getAllProducts = async (): Promise<Product[]> => {
  // Check cache first
  const cached = getCachedProducts();
  if (cached && cached.length > 0) {
    console.log(`📦 Using cached products: ${cached.length} products`);
    return cached;
  }

  // Fetch from API
  try {
    console.log('🌐 Fetching products from DummyJSON API...');
    const products = await fetchAllProducts();
    
    // Cache the results
    if (products.length > 0) {
      cacheProducts(products);
      return products;
    } else {
      throw new Error('No products received from API');
    }
  } catch (error: any) {
    console.error('Failed to fetch products:', error);
    // Try to return cached data even if expired
    const expiredCache = localStorage.getItem(CACHE_KEY);
    if (expiredCache) {
      try {
        const cached = JSON.parse(expiredCache);
        if (cached && cached.length > 0) {
          console.log(`⚠️ Using expired cache as fallback: ${cached.length} products`);
          return cached;
        }
      } catch (e) {
        console.error('Error parsing expired cache:', e);
      }
    }
    throw error; // Re-throw if no fallback available
  }
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (category: 'mens' | 'womens' | 'kids' | 'traditional' | 'genz'): Promise<Product[]> => {
  const allProducts = await getAllProducts();
  const categoryLower = category.toLowerCase();
  
  // Get DummyJSON categories for this category
  const dummyJsonCategories = CATEGORY_MAPPING[categoryLower] || [];
  
  // If no products, return empty array
  if (allProducts.length === 0) {
    console.warn('No products available for category filtering');
    return [];
  }
  
  const filtered = allProducts.filter(product => {
    const productCategory = product.category?.toLowerCase() || '';
    const productTags = product.tags?.map(t => t.toLowerCase()) || [];
    const productGender = product.gender?.toLowerCase() || '';
    
    // Check if product matches any of the mapped categories
    const matchesCategory = dummyJsonCategories.some(cat => {
      const catLower = cat.toLowerCase();
      return productCategory.includes(catLower) ||
             productTags.some(tag => tag.includes(catLower)) ||
             productCategory.includes(catLower.replace('-', ' '));
    });
    
    // Check gender match
    const matchesGender = productGender === categoryLower ||
                         (categoryLower === 'mens' && productGender === 'men') ||
                         (categoryLower === 'womens' && productGender === 'women');
    
    // Special handling for different categories
    if (categoryLower === 'genz') {
      // GenZ: high-rated trendy products
      return matchesCategory || matchesGender || (product.rating && product.rating > 4.0);
    }
    
    if (categoryLower === 'traditional') {
      // Traditional: dresses, shirts, home decoration, furniture
      return matchesCategory || 
             productCategory.includes('dress') ||
             productCategory.includes('shirt') ||
             productCategory.includes('decoration') ||
             productCategory.includes('furniture');
    }
    
    if (categoryLower === 'kids') {
      // Kids: smaller items, toys, or lower-priced items
      return matchesCategory || 
             product.price < 100 ||
             productCategory.includes('tops') ||
             productCategory.includes('smartphone') ||
             productCategory.includes('tablet');
    }
    
    // For mens and womens, use category and gender matching
    return matchesCategory || matchesGender;
  });
  
  console.log(`Filtered ${filtered.length} products for category: ${category} from ${allProducts.length} total products`);
  
  // If filtering is too strict and returns very few products, return a mix
  if (filtered.length < 50 && allProducts.length > 100) {
    console.log(`⚠️ Category filter too strict (${filtered.length} products), returning mix of filtered + random products`);
    // Take filtered products + random products from all to ensure we have enough
    const randomProducts = allProducts
      .filter(p => !filtered.some(f => f.id === p.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.max(100 - filtered.length, 50));
    return [...filtered, ...randomProducts].slice(0, 200); // Limit to 200 products max
  }
  
  return filtered.slice(0, 200); // Limit to 200 products max
};

/**
 * Get men's products
 */
export const getMensProducts = async (): Promise<Product[]> => {
  return getProductsByCategory('mens');
};

/**
 * Get women's products
 */
export const getWomensProducts = async (): Promise<Product[]> => {
  return getProductsByCategory('womens');
};

/**
 * Get kids products
 */
export const getKidsProducts = async (): Promise<Product[]> => {
  return getProductsByCategory('kids');
};

/**
 * Get traditional products
 */
export const getTraditionalProducts = async (): Promise<Product[]> => {
  return getProductsByCategory('traditional');
};

/**
 * Get GenZ products
 */
export const getGenZProducts = async (): Promise<Product[]> => {
  return getProductsByCategory('genz');
};

/**
 * Get product by ID
 */
export const getProductById = async (id: number): Promise<Product | null> => {
  const allProducts = await getAllProducts();
  return allProducts.find(p => p.id === id) || null;
};

/**
 * Search products
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

/**
 * Clear cache (useful for testing or forcing refresh)
 */
export const clearCache = (): void => {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  console.log('🗑️ Cache cleared');
};


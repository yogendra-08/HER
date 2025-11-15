/**
 * Men's Collection Page
 * Modern, premium page showcasing men's fashion products
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, ShoppingCart, Filter, X, Eye, Star } from 'lucide-react';
import { Product } from '../utils/api';
import { useCart } from '../hooks/useCart';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

// Interface matching the JSON structure
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
  sizes: string[];
}

// Placeholder products for Men's collection
const useMensProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/mens_products.json');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};
  {
    id: 302,
    name: 'Slim Fit Denim Jeans',
    description: 'Comfortable slim fit jeans with stretch fabric',
    price: 3299,
    category: 'Urban Threads',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop',
    stock: 18,
    rating: 4.7,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 303,
    name: 'Casual Hoodie',
    description: 'Comfortable cotton hoodie perfect for everyday wear',
    price: 2799,
    category: 'Street Style',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop',
    stock: 22,
    rating: 4.6,
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 304,
    name: 'Formal Blazer',
    description: 'Elegant blazer for business and formal events',
    price: 5999,
    category: 'Aria Luxe',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop',
    stock: 15,
    rating: 4.9,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 305,
    name: 'Bomber Jacket',
    description: 'Stylish bomber jacket with modern design',
    price: 4499,
    category: 'Urban Threads',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
    stock: 16,
    rating: 4.7,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 306,
    name: 'Slim Fit T-Shirt',
    description: 'Comfortable slim fit t-shirt with premium fabric',
    price: 1299,
    category: 'Street Style',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
    stock: 25,
    rating: 4.5,
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 307,
    name: 'Chino Pants',
    description: 'Classic chino pants perfect for smart casual look',
    price: 2999,
    category: 'Aria Luxe',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop',
    stock: 19,
    rating: 4.6,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 308,
    name: 'Leather Jacket',
    description: 'Premium leather jacket with classic design',
    price: 8999,
    category: 'Urban Threads',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
    stock: 12,
    rating: 4.8,
    sizes: ['M', 'L', 'XL', 'XXL']
  },
  {
    id: 309,
    name: 'Polo Shirt',
    description: 'Classic polo shirt for casual and semi-formal occasions',
    price: 1999,
    category: 'Street Style',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
    stock: 21,
    rating: 4.6,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 310,
    name: 'Cargo Pants',
    description: 'Stylish cargo pants with multiple pockets',
    price: 3199,
    category: 'Aria Luxe',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop',
    stock: 17,
    rating: 4.5,
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 311,
    name: 'Wool Sweater',
    description: 'Warm wool sweater for winter season',
    price: 3999,
    category: 'Urban Threads',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
    stock: 14,
    rating: 4.7,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 312,
    name: 'Formal Trousers',
    description: 'Elegant formal trousers for business wear',
    price: 3499,
    category: 'Aria Luxe',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop',
    stock: 18,
    rating: 4.8,
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 313,
    name: 'Denim Jacket',
    description: 'Classic denim jacket with vintage wash',
    price: 3799,
    category: 'Street Style',
    image: 'https://images.unsplash.com/photo-1593032465171-8f0b7a0b78cd?w=600&h=800&fit=crop',
    stock: 20,
    rating: 4.6,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 314,
    name: 'Track Pants',
    description: 'Comfortable track pants for active lifestyle',
    price: 2299,
    category: 'Urban Threads',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop',
    stock: 23,
    rating: 4.5,
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 315,
    name: 'Button Down Shirt',
    description: 'Versatile button down shirt for casual wear',
    price: 2199,
    category: 'Aria Luxe',
    image: 'https://images.unsplash.com/photo-1520975922203-27d7c9691a49?w=600&h=800&fit=crop',
    stock: 19,
    rating: 4.7,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 316,
    name: 'Hooded Sweatshirt',
    description: 'Comfortable hooded sweatshirt for casual days',
    price: 2599,
    category: 'Street Style',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop',
    stock: 21,
    rating: 4.6,
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 317,
    name: 'Suit Jacket',
    description: 'Premium suit jacket for formal occasions',
    price: 7999,
    category: 'Aria Luxe',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop',
    stock: 11,
    rating: 4.9,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 318,
    name: 'Jogger Pants',
    description: 'Comfortable jogger pants with elastic waist',
    price: 2399,
    category: 'Urban Threads',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop',
    stock: 24,
    rating: 4.5,
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 319,
    name: 'V-Neck Sweater',
    description: 'Classic V-neck sweater for layering',
    price: 2899,
    category: 'Street Style',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
    stock: 16,
    rating: 4.6,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 320,
    name: 'Casual Shorts',
    description: 'Comfortable casual shorts for summer',
    price: 1799,
    category: 'Aria Luxe',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop',
    stock: 22,
    rating: 4.4,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 321,
    name: 'Trench Coat',
    description: 'Elegant trench coat for formal occasions',
    price: 6999,
    category: 'Urban Threads',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
    stock: 13,
    rating: 4.8,
    sizes: ['M', 'L', 'XL', 'XXL']
  },
  {
    id: 322,
    name: 'Henley Shirt',
    description: 'Comfortable henley shirt with button placket',
    price: 1899,
    category: 'Street Style',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
    stock: 20,
    rating: 4.5,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 323,
    name: 'Corduroy Pants',
    description: 'Vintage-inspired corduroy pants',
    price: 2699,
    category: 'Aria Luxe',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop',
    stock: 18,
    rating: 4.6,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 324,
    name: 'Windbreaker Jacket',
    description: 'Lightweight windbreaker for outdoor activities',
    price: 3399,
    category: 'Urban Threads',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
    stock: 15,
    rating: 4.7,
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  }
];

interface MensProductCardProps {
  product: Product;
}

const MensProductCard: React.FC<MensProductCardProps> = ({ product }) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id);
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const originalPrice = Math.round(product.price * 1.25);
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  const inCart = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  // Generate secondary image
  const secondaryImage = product.image.replace('w=600', 'w=601');

  // Determine badge (New Arrival, Limited Edition, etc.)
  const isNew = product.id >= 301 && product.id <= 304;
  const isLimited = product.id === 308 || product.id === 317 || product.id === 321;

  return (
    <div
      className="mens-product-card group relative bg-white overflow-hidden"
      style={{
        borderRadius: '8px',
        border: '1px solid #efefef',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        {/* Primary Image */}
        <img
          src={product.image}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`}
        />
        
        {/* Secondary Image (reveals on hover) */}
        <img
          src={secondaryImage}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Badges */}
        {isNew && (
          <div
            className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold text-white"
            style={{ background: '#000000', borderRadius: '4px' }}
          >
            New Arrival
          </div>
        )}
        {isLimited && (
          <div
            className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold text-white"
            style={{ background: '#d4af37', borderRadius: '4px' }}
          >
            Limited Edition
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && !isNew && !isLimited && (
          <div
            className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold text-white"
            style={{ background: '#000000', borderRadius: '4px' }}
          >
            {discount}% OFF
          </div>
        )}

        {/* Wishlist Icon - Top Right */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 z-10"
          style={{ border: '1px solid #efefef' }}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 bg-white">
        {/* Category */}
        <p className="text-xs mb-1 uppercase tracking-wide" style={{ color: '#8B3A3A' }}>
          {product.category}
        </p>

        {/* Product Title */}
        <h3 className="text-base font-bold mb-2 line-clamp-2 leading-snug" style={{ color: '#2C1810' }}>
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm mb-3 line-clamp-2" style={{ color: '#4A2E29' }}>
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm ml-2" style={{ color: '#4A2E29' }}>({product.rating})</span>
        </div>

        {/* Price and Stock */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold" style={{ color: '#8B3A3A' }}>
              {formatPrice(product.price)}
            </span>
            {discount > 0 && (
              <span className="text-sm line-through" style={{ color: '#4A2E29' }}>
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          <div className="text-sm" style={{ color: '#4A2E29' }}>
            {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          <Link
            to={`/products/${product.id}`}
            className="w-full py-2 px-4 rounded-luxury font-medium transition-all duration-300 text-center border-2 flex items-center justify-center"
            style={{ 
              borderColor: '#C49E54',
              color: '#8B3A3A',
              background: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#C49E54';
              e.currentTarget.style.color = '#2C1810';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#8B3A3A';
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Link>
          
          <div className="flex space-x-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm py-2 px-4 rounded-luxury font-medium transition-all duration-300 flex items-center justify-center"
              style={{ background: '#2C1810', color: '#F7F4EF' }}
              onMouseEnter={(e) => {
                if (product.stock > 0) {
                  e.currentTarget.style.background = '#C49E54';
                  e.currentTarget.style.color = '#2C1810';
                }
              }}
              onMouseLeave={(e) => {
                if (product.stock > 0) {
                  e.currentTarget.style.background = '#2C1810';
                  e.currentTarget.style.color = '#F7F4EF';
                }
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {inCart ? `In Cart (${cartQuantity})` : 'Add to Cart'}
            </button>
            
            <button
              onClick={handleWishlist}
              className="p-2 border border-gold/30 rounded-luxury hover:border-gold hover:text-gold transition-colors"
              style={{ borderColor: '#C49E54' }}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton Loader Component
const ProductSkeleton: React.FC = () => {
  return (
    <div className="mens-product-card bg-white overflow-hidden animate-pulse" style={{ borderRadius: '8px', border: '1px solid #efefef' }}>
      <div className="relative aspect-[3/4] bg-gray-200"></div>
      <div className="p-4">
        <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
};

const MensCollectionPage: React.FC = () => {
  const { products: mensProducts, loading, error } = useMensProducts();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const filterRef = useRef<HTMLDivElement>(null);

  // Filter and sort products
  useEffect(() => {
    let result = [...mensProducts];

    // Apply price filter
    result = result.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply size filter
    if (selectedSizes.length > 0) {
      result = result.filter((product) =>
        selectedSizes.some((size) => product.sizes.includes(size))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'price-low-high':
          return a.price - b.price;
        case 'price-high-low':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.id - a.id;
        default:
          return 0;
      }
    });

    setFilteredProducts(result);
  }, [mensProducts, sortOption, priceRange, selectedSizes]);
  const [allProducts] = useState<Product[]>(mensProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  
  const PRODUCTS_PER_PAGE = 8;
  const INITIAL_PRODUCTS = 16;

  // Get unique brands, sizes, and styles
  const brands = Array.from(new Set(allProducts.map(p => p.category)));
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const styles = ['Casual', 'Streetwear', 'Formal'];

  // Filter and sort products
  useEffect(() => {
    let filtered = [...allProducts];

    // Filter by size
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p => 
        p.sizes.some(size => selectedSizes.includes(size))
      );
    }

    // Filter by price
    filtered = filtered.filter(p => 
      p.price >= priceRange.min && p.price <= priceRange.max
    );

    // Filter by brand
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.category));
    }

    // Filter by style (based on product name/category)
    if (selectedStyles.length > 0) {
      filtered = filtered.filter(p => {
        const name = p.name.toLowerCase();
        if (selectedStyles.includes('Casual') && (name.includes('casual') || name.includes('hoodie') || name.includes('t-shirt') || name.includes('shorts'))) {
          return true;
        }
        if (selectedStyles.includes('Streetwear') && (name.includes('street') || name.includes('bomber') || name.includes('cargo') || name.includes('jogger'))) {
          return true;
        }
        if (selectedStyles.includes('Formal') && (name.includes('formal') || name.includes('blazer') || name.includes('suit') || name.includes('trousers') || name.includes('shirt'))) {
          return true;
        }
        return false;
      });
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        filtered.sort((a, b) => {
          const discountA = Math.round(((Math.round(a.price * 1.25) - a.price) / Math.round(a.price * 1.25)) * 100);
          const discountB = Math.round(((Math.round(b.price * 1.25) - b.price) / Math.round(b.price * 1.25)) * 100);
          return discountB - discountA;
        });
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => b.id - a.id);
        break;
    }

    setFilteredProducts(filtered);
    const initialCount = Math.min(INITIAL_PRODUCTS, filtered.length);
    setDisplayedProducts(filtered.slice(0, initialCount));
    setHasMore(filtered.length > initialCount);
  }, [selectedSizes, priceRange, selectedBrands, selectedStyles, sortBy, allProducts]);

  // Load more products function
  const loadMoreProducts = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    setTimeout(() => {
      const currentCount = displayedProducts.length;
      const startIndex = currentCount;
      const endIndex = startIndex + PRODUCTS_PER_PAGE;
      const nextProducts = filteredProducts.slice(startIndex, endIndex);

      if (nextProducts.length > 0) {
        setDisplayedProducts(prev => [...prev, ...nextProducts]);
        setHasMore(endIndex < filteredProducts.length);
      } else {
        setHasMore(false);
      }
      setIsLoading(false);
    }, 500);
  }, [displayedProducts.length, filteredProducts, isLoading, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, loadMoreProducts]);

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedBrands([]);
    setSelectedStyles([]);
    setPriceRange({ min: 0, max: 10000 });
  };

  return (
    <div className="min-h-screen" style={{ background: '#f3eee7' }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 
            className="text-5xl font-semibold font-heading mb-3"
            style={{ color: '#000000', fontWeight: 600 }}
          >
            Men's Collection
          </h1>
          <p 
            className="text-base text-gray-600 max-w-2xl mx-auto"
            style={{ letterSpacing: '0.02em' }}
          >
            Trendy & Classic Styles Curated for Modern Men
          </p>
        </div>

        {/* Filters and Sort Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Filter Toggle Button (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="newest">Newest</option>
              <option value="popular">Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Discount</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-black">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-500 hover:text-black"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Size Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-black mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                        selectedSizes.includes(size)
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-gray-300 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-black mb-3">Style</h3>
                <div className="space-y-2">
                  {styles.map(style => (
                    <label key={style} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedStyles.includes(style)}
                        onChange={() => toggleStyle(style)}
                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                      />
                      <span className="ml-2 text-sm text-gray-700">{style}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-black mb-3">Brand</h3>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                      />
                      <span className="ml-2 text-sm text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-black mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-4 text-sm text-gray-600">
              {filteredProducts.length} products found
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="fade-in-up"
                  style={{
                    animationDelay: `${(index % PRODUCTS_PER_PAGE) * 50}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <MensProductCard product={product} />
                </div>
              ))}
              
              {/* Loading Skeletons */}
              {isLoading && (
                <>
                  {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, index) => (
                    <ProductSkeleton key={`skeleton-${index}`} />
                  ))}
                </>
              )}
            </div>
            
            {/* Infinite Scroll Trigger */}
            <div ref={observerTarget} className="h-10"></div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-600">No products found matching your filters.</p>
              </div>
            )}
            
            {!hasMore && displayedProducts.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">You've reached the end of the collection</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MensCollectionPage;


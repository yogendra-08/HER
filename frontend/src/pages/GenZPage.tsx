/**
 * Gen Z Collection Page
 * Modern, trendy page showcasing Gen Z fashion products
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, ShoppingCart, Filter, X, Eye, Star } from 'lucide-react';
import { Product } from '../utils/api';
import { useCart } from '../hooks/useCart';
import { getAllProducts } from '../services/localJsonService';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

// Custom hook to fetch GenZ products
const useGenZProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // GenZ: Get mix of all products (trendy/young audience)
        const allProducts = await getAllProducts();
        // Filter for high-rated products or take a random sample
        const genZProducts = allProducts
          .filter(p => (p.rating && p.rating > 4.0) || Math.random() > 0.5)
          .slice(0, 200); // Limit to 200 products
        setProducts(genZProducts);
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

// Placeholder products for Gen Z collection (fallback)
const genZProducts: Product[] = [
  {
    id: 201,
    name: 'Street Style Hoodie',
    description: 'Comfortable oversized hoodie perfect for casual streetwear',
    price: 2499,
    category: 'Aria Luxe',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop',
    stock: 20,
    rating: 4.7,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 202,
    name: 'Graphic Print Tee',
    description: 'Trendy graphic t-shirt with bold prints and modern design',
    price: 1299,
    category: 'Urban Threads',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
    stock: 25,
    rating: 4.6,
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 203,
    name: 'Vintage Denim Jacket',
    description: 'Classic denim jacket with vintage wash and modern fit',
    price: 3499,
    category: 'Street Style',
    image: 'https://images.unsplash.com/photo-1593032465171-8f0b7a0b78cd?w=600&h=800&fit=crop',
    stock: 15,
    rating: 4.8,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 204,
    name: 'Cargo Pants',
    description: 'Stylish cargo pants with multiple pockets and relaxed fit',
    price: 2799,
    category: 'Urban Threads',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop',
    stock: 18,
    rating: 4.5,
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 205,
    name: 'Oversized Sweatshirt',
    description: 'Comfortable oversized sweatshirt perfect for layering',
    price: 1999,
    category: 'Aria Luxe',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop',
    stock: 22,
    rating: 4.6,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 206,
    name: 'High-Waisted Jeans',
    description: 'Trendy high-waisted jeans with perfect fit and stretch',
    price: 3299,
    category: 'Street Style',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop',
    stock: 16,
    rating: 4.7,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 207,
    name: 'Cropped Hoodie',
    description: 'Stylish cropped hoodie with modern design and comfortable fit',
    price: 2199,
    category: 'Urban Threads',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop',
    stock: 19,
    rating: 4.6,
    sizes: ['S', 'M', 'L']
  },
  {
    id: 208,
    name: 'Biker Shorts',
    description: 'Athletic-inspired biker shorts perfect for street style',
    price: 1499,
    category: 'Aria Luxe',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop',
    stock: 24,
    rating: 4.5,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 209,
    name: 'Puffer Jacket',
    description: 'Warm and stylish puffer jacket for winter streetwear',
    price: 4499,
    category: 'Street Style',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
    stock: 12,
    rating: 4.8,
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 210,
    name: 'Tie-Dye Tee',
    description: 'Vibrant tie-dye t-shirt with unique patterns',
    price: 1599,
    category: 'Urban Threads',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
    stock: 21,
    rating: 4.6,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 211,
    name: 'Cargo Shorts',
    description: 'Casual cargo shorts with multiple pockets',
    price: 1899,
    category: 'Aria Luxe',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop',
    stock: 17,
    rating: 4.5,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 212,
    name: 'Oversized Blazer',
    description: 'Trendy oversized blazer perfect for smart casual looks',
    price: 3999,
    category: 'Street Style',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop',
    stock: 14,
    rating: 4.7,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 213,
    name: 'Y2K Crop Top',
    description: 'Trendy Y2K inspired crop top with modern fit',
    price: 1299,
    category: 'Aria Luxe',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
    stock: 20,
    rating: 4.6,
    sizes: ['S', 'M', 'L']
  },
  {
    id: 214,
    name: 'Baggy Jeans',
    description: 'Comfortable baggy jeans with relaxed fit',
    price: 2999,
    category: 'Urban Threads',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop',
    stock: 18,
    rating: 4.7,
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 215,
    name: 'Mesh Tank Top',
    description: 'Stylish mesh tank top perfect for layering',
    price: 999,
    category: 'Street Style',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
    stock: 22,
    rating: 4.5,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 216,
    name: 'Platform Sneakers',
    description: 'Trendy platform sneakers for street style',
    price: 4999,
    category: 'Aria Luxe',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop',
    stock: 15,
    rating: 4.8,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 217,
    name: 'Corduroy Pants',
    description: 'Vintage-inspired corduroy pants with modern fit',
    price: 2499,
    category: 'Urban Threads',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop',
    stock: 16,
    rating: 4.6,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 218,
    name: 'Bucket Hat',
    description: 'Stylish bucket hat for casual streetwear',
    price: 799,
    category: 'Street Style',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=800&fit=crop',
    stock: 25,
    rating: 4.5,
    sizes: ['One Size']
  },
  {
    id: 219,
    name: 'Cargo Skirt',
    description: 'Trendy cargo skirt with multiple pockets',
    price: 2199,
    category: 'Aria Luxe',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop',
    stock: 19,
    rating: 4.7,
    sizes: ['S', 'M', 'L']
  },
  {
    id: 220,
    name: 'Oversized T-Shirt',
    description: 'Comfortable oversized t-shirt with graphic print',
    price: 1499,
    category: 'Urban Threads',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
    stock: 23,
    rating: 4.6,
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 221,
    name: 'Wide Leg Pants',
    description: 'Comfortable wide leg pants with flowy fit',
    price: 2799,
    category: 'Street Style',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop',
    stock: 17,
    rating: 4.7,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 222,
    name: 'Corset Top',
    description: 'Trendy corset top with modern design',
    price: 3299,
    category: 'Aria Luxe',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
    stock: 14,
    rating: 4.8,
    sizes: ['S', 'M', 'L']
  },
  {
    id: 223,
    name: 'Chunky Boots',
    description: 'Stylish chunky boots for street style',
    price: 5499,
    category: 'Urban Threads',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop',
    stock: 12,
    rating: 4.9,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 224,
    name: 'Plaid Shirt',
    description: 'Classic plaid shirt with modern fit',
    price: 2299,
    category: 'Street Style',
    image: 'https://images.unsplash.com/photo-1520975922203-27d7c9691a49?w=600&h=800&fit=crop',
    stock: 20,
    rating: 4.6,
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 225,
    name: 'Mini Skirt',
    description: 'Trendy mini skirt perfect for casual wear',
    price: 1799,
    category: 'Aria Luxe',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop',
    stock: 18,
    rating: 4.5,
    sizes: ['S', 'M', 'L']
  },
  {
    id: 226,
    name: 'Baseball Cap',
    description: 'Classic baseball cap with modern design',
    price: 899,
    category: 'Urban Threads',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=800&fit=crop',
    stock: 24,
    rating: 4.4,
    sizes: ['One Size']
  },
  {
    id: 227,
    name: 'Ribbed Tank',
    description: 'Comfortable ribbed tank top with stretch',
    price: 1199,
    category: 'Street Style',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
    stock: 21,
    rating: 4.6,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 228,
    name: 'Flare Jeans',
    description: 'Vintage-inspired flare jeans with modern fit',
    price: 3499,
    category: 'Aria Luxe',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop',
    stock: 16,
    rating: 4.7,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 229,
    name: 'Puffer Vest',
    description: 'Stylish puffer vest for layering',
    price: 2999,
    category: 'Urban Threads',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
    stock: 19,
    rating: 4.6,
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 230,
    name: 'Cargo Joggers',
    description: 'Comfortable cargo joggers with multiple pockets',
    price: 2399,
    category: 'Street Style',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop',
    stock: 17,
    rating: 4.5,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 231,
    name: 'Oversized Blouse',
    description: 'Elegant oversized blouse with modern design',
    price: 2699,
    category: 'Aria Luxe',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
    stock: 15,
    rating: 4.7,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 232,
    name: 'Dad Sneakers',
    description: 'Trendy dad sneakers for street style',
    price: 4499,
    category: 'Urban Threads',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop',
    stock: 13,
    rating: 4.8,
    sizes: ['S', 'M', 'L', 'XL']
  }
];

interface GenZProductCardProps {
  product: Product;
}

const GenZProductCard: React.FC<GenZProductCardProps> = ({ product }) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = async () => {
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        gender: product.gender,
        collection: product.gender === 'women' ? 'women' : product.gender === 'men' ? 'men' : undefined,
      });
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

  return (
    <div
      className="genz-product-card group relative bg-white overflow-hidden"
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

        {/* Discount Badge */}
        {discount > 0 && (
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
          to={`/product/${product.id}`}
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
    <div className="genz-product-card bg-white overflow-hidden animate-pulse" style={{ borderRadius: '8px', border: '1px solid #efefef' }}>
      <div className="relative aspect-[3/4] bg-gray-200"></div>
      <div className="p-4">
        <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
};

const GenZPage: React.FC = () => {
  const { products: fetchedProducts, loading: isLoadingProducts } = useGenZProducts();
  const [allProducts, setAllProducts] = useState<Product[]>(genZProducts);
  
  useEffect(() => {
    if (fetchedProducts.length > 0) {
      setAllProducts(fetchedProducts);
    }
  }, [fetchedProducts]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const observerTarget = useRef<HTMLDivElement>(null);
  
  const PRODUCTS_PER_PAGE = 8;
  const INITIAL_PRODUCTS = 16; // Show 16 products initially

  // Get unique brands and sizes
  const brands = Array.from(new Set(allProducts.map(p => p.category)));
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

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
      case 'newest':
      default:
        filtered.sort((a, b) => b.id - a.id);
        break;
    }

    setFilteredProducts(filtered);
    // Show initial products (16) or all if less than 16
    const initialCount = Math.min(INITIAL_PRODUCTS, filtered.length);
    setDisplayedProducts(filtered.slice(0, initialCount));
    setHasMore(filtered.length > initialCount);
  }, [selectedSizes, priceRange, selectedBrands, sortBy, allProducts]);

  // Load more products function
  const loadMoreProducts = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    // Simulate loading delay for better UX
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

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedBrands([]);
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
            Gen Z Collection
          </h1>
          <p 
            className="text-base text-gray-600 max-w-2xl mx-auto"
            style={{ letterSpacing: '0.02em' }}
          >
            Trendy, handpicked styles for Gen Z
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
                  <GenZProductCard product={product} />
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

export default GenZPage;


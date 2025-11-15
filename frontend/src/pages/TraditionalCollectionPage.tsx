/**
 * Traditional Collection Page
 * Premium page showcasing traditional Indian fashion products
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, ShoppingCart, Filter, X, Eye, Star } from 'lucide-react';
import { Product } from '../utils/api';
import { useCart } from '../hooks/useCart';
import { getAllProducts } from '../services/localJsonService';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

// Custom hook to fetch Traditional products
const useTraditionalProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Traditional: Get all products and filter for traditional items
        const allProducts = await getAllProducts();
        // Filter for traditional categories or use all products if no matches
        let traditionalProducts = allProducts.filter(p => 
          p.category?.toLowerCase().includes('traditional') ||
          p.category?.toLowerCase().includes('ethnic') ||
          p.name?.toLowerCase().includes('saree') ||
          p.name?.toLowerCase().includes('kurta') ||
          p.name?.toLowerCase().includes('lehenga')
        );
        
        // If no traditional products found, use all products
        if (traditionalProducts.length === 0) {
          traditionalProducts = allProducts;
        }
        
        traditionalProducts = traditionalProducts.slice(0, 200); // Limit to 200 products
        setProducts(traditionalProducts);
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

// Placeholder products for Traditional collection (fallback)
const traditionalProducts: Product[] = [
  {
    id: 601,
    name: 'Banarasi Silk Saree',
    description: 'Exquisite Banarasi silk saree with intricate zari work and traditional motifs',
    price: 4999,
    category: 'Heritage Craft',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop',
    stock: 12,
    rating: 4.9,
    sizes: ['Free Size']
  },
  {
    id: 602,
    name: 'Kanjivaram Silk Saree',
    description: 'Premium Kanjivaram silk saree with temple border and rich zari work',
    price: 6999,
    category: 'Heritage Craft',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop',
    stock: 10,
    rating: 4.9,
    sizes: ['Free Size']
  },
  {
    id: 603,
    name: 'Handloom Cotton Saree',
    description: 'Authentic handloom cotton saree with traditional weaves',
    price: 2199,
    category: 'Artisan Made',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop',
    stock: 18,
    rating: 4.7,
    sizes: ['Free Size']
  },
  {
    id: 604,
    name: 'Traditional Kurta Set',
    description: 'Elegant traditional kurta set with churidar and dupatta',
    price: 2799,
    category: 'Heritage Craft',
    image: 'https://images.unsplash.com/photo-1616469829960-18aef209d661?w=600&h=800&fit=crop',
    stock: 16,
    rating: 4.8,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 605,
    name: 'Bandhani Saree',
    description: 'Vibrant Bandhani saree with traditional tie-dye patterns',
    price: 2399,
    category: 'Artisan Made',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop',
    stock: 15,
    rating: 4.6,
    sizes: ['Free Size']
  },
  {
    id: 606,
    name: 'Patola Silk Saree',
    description: 'Luxury Patola silk saree with double ikat weave',
    price: 8999,
    category: 'Heritage Craft',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop',
    stock: 8,
    rating: 5.0,
    sizes: ['Free Size']
  },
  {
    id: 607,
    name: 'Chanderi Saree',
    description: 'Elegant Chanderi saree with delicate zari work',
    price: 3499,
    category: 'Artisan Made',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop',
    stock: 14,
    rating: 4.8,
    sizes: ['Free Size']
  },
  {
    id: 608,
    name: 'Traditional Lehenga',
    description: 'Exquisite traditional lehenga with heavy embroidery',
    price: 7999,
    category: 'Heritage Craft',
    image: 'https://images.unsplash.com/photo-1622021830629-066c09ad248c?w=600&h=800&fit=crop',
    stock: 9,
    rating: 4.9,
    sizes: ['S', 'M', 'L']
  },
  {
    id: 609,
    name: 'Kalamkari Saree',
    description: 'Beautiful Kalamkari saree with hand-painted motifs',
    price: 2999,
    category: 'Artisan Made',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop',
    stock: 13,
    rating: 4.7,
    sizes: ['Free Size']
  },
  {
    id: 610,
    name: 'Men\'s Traditional Kurta',
    description: 'Premium traditional kurta with hand embroidery',
    price: 2499,
    category: 'Heritage Craft',
    image: 'https://images.unsplash.com/photo-1621786860304-1b1a0a0197a1?w=600&h=800&fit=crop',
    stock: 17,
    rating: 4.6,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 611,
    name: 'Tant Saree',
    description: 'Traditional Tant saree from West Bengal with beautiful borders',
    price: 1899,
    category: 'Artisan Made',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop',
    stock: 19,
    rating: 4.5,
    sizes: ['Free Size']
  },
  {
    id: 612,
    name: 'Paithani Saree',
    description: 'Luxury Paithani saree with peacock motifs and zari work',
    price: 9999,
    category: 'Heritage Craft',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop',
    stock: 7,
    rating: 5.0,
    sizes: ['Free Size']
  },
  {
    id: 613,
    name: 'Chikankari Anarkali',
    description: 'Elegant Chikankari Anarkali with delicate hand embroidery',
    price: 3299,
    category: 'Artisan Made',
    image: 'https://images.unsplash.com/photo-1616469829960-18aef209d661?w=600&h=800&fit=crop',
    stock: 15,
    rating: 4.8,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 614,
    name: 'Traditional Sherwani',
    description: 'Luxury traditional sherwani for weddings and special occasions',
    price: 8999,
    category: 'Heritage Craft',
    image: 'https://images.unsplash.com/photo-1621786860304-1b1a0a0197a1?w=600&h=800&fit=crop',
    stock: 8,
    rating: 4.9,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 615,
    name: 'Kota Doria Saree',
    description: 'Lightweight Kota Doria saree with checkered patterns',
    price: 2599,
    category: 'Artisan Made',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop',
    stock: 16,
    rating: 4.6,
    sizes: ['Free Size']
  },
  {
    id: 616,
    name: 'Traditional Salwar Suit',
    description: 'Elegant traditional salwar suit with intricate embroidery',
    price: 2799,
    category: 'Heritage Craft',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop',
    stock: 14,
    rating: 4.7,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 617,
    name: 'Maheshwari Saree',
    description: 'Beautiful Maheshwari saree with traditional borders',
    price: 2899,
    category: 'Artisan Made',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop',
    stock: 17,
    rating: 4.6,
    sizes: ['Free Size']
  },
  {
    id: 618,
    name: 'Traditional Dhoti Kurta',
    description: 'Classic traditional dhoti kurta set for men',
    price: 3499,
    category: 'Heritage Craft',
    image: 'https://images.unsplash.com/photo-1621786860304-1b1a0a0197a1?w=600&h=800&fit=crop',
    stock: 11,
    rating: 4.8,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 619,
    name: 'Jamdani Saree',
    description: 'Exquisite Jamdani saree with intricate muslin weave',
    price: 4499,
    category: 'Artisan Made',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop',
    stock: 10,
    rating: 4.9,
    sizes: ['Free Size']
  },
  {
    id: 620,
    name: 'Traditional Lehenga Choli',
    description: 'Luxury traditional lehenga choli with heavy work',
    price: 6999,
    category: 'Heritage Craft',
    image: 'https://images.unsplash.com/photo-1622021830629-066c09ad248c?w=600&h=800&fit=crop',
    stock: 9,
    rating: 4.9,
    sizes: ['S', 'M', 'L']
  },
  {
    id: 621,
    name: 'Ikkat Saree',
    description: 'Beautiful Ikkat saree with geometric patterns',
    price: 3199,
    category: 'Artisan Made',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop',
    stock: 13,
    rating: 4.7,
    sizes: ['Free Size']
  },
  {
    id: 622,
    name: 'Traditional Angrakha',
    description: 'Elegant traditional angrakha with mirror work',
    price: 2699,
    category: 'Heritage Craft',
    image: 'https://images.unsplash.com/photo-1616469829960-18aef209d661?w=600&h=800&fit=crop',
    stock: 15,
    rating: 4.6,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 623,
    name: 'Gadwal Saree',
    description: 'Luxury Gadwal saree with rich zari borders',
    price: 5999,
    category: 'Artisan Made',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop',
    stock: 11,
    rating: 4.8,
    sizes: ['Free Size']
  },
  {
    id: 624,
    name: 'Traditional Jodhpuri Suit',
    description: 'Elegant Jodhpuri suit for formal traditional occasions',
    price: 7999,
    category: 'Heritage Craft',
    image: 'https://images.unsplash.com/photo-1621786860304-1b1a0a0197a1?w=600&h=800&fit=crop',
    stock: 8,
    rating: 4.9,
    sizes: ['S', 'M', 'L', 'XL']
  }
];

interface TraditionalProductCardProps {
  product: Product;
}

const TraditionalProductCard: React.FC<TraditionalProductCardProps> = ({ product }) => {
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

  const secondaryImage = product.image.replace('w=600', 'w=601');

  return (
    <div
      className="traditional-product-card group relative bg-white overflow-hidden"
      style={{
        borderRadius: '8px',
        border: '1px solid #efefef',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <img
          src={secondaryImage}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {discount > 0 && (
          <div
            className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold text-white"
            style={{ background: '#000000', borderRadius: '4px' }}
          >
            {discount}% OFF
          </div>
        )}

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

      <div className="p-4 bg-white">
        <p className="text-xs mb-1 uppercase tracking-wide" style={{ color: '#8B3A3A' }}>
          {product.category}
        </p>
        <h3 className="text-base font-bold mb-2 line-clamp-2 leading-snug" style={{ color: '#2C1810' }}>
          {product.name}
        </h3>
        <p className="text-sm mb-3 line-clamp-2" style={{ color: '#4A2E29' }}>
          {product.description}
        </p>
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

const ProductSkeleton: React.FC = () => {
  return (
    <div className="traditional-product-card bg-white overflow-hidden animate-pulse" style={{ borderRadius: '8px', border: '1px solid #efefef' }}>
      <div className="relative aspect-[3/4] bg-gray-200"></div>
      <div className="p-4">
        <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
};

const TraditionalCollectionPage: React.FC = () => {
  const { products: fetchedProducts, loading: isLoadingProducts } = useTraditionalProducts();
  const [allProducts, setAllProducts] = useState<Product[]>(traditionalProducts);
  
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
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  
  const PRODUCTS_PER_PAGE = 8;
  const INITIAL_PRODUCTS = 16;

  const brands = Array.from(new Set(allProducts.map(p => p.category)));
  const sizes = ['S', 'M', 'L', 'XL', 'Free Size'];
  const types = ['Saree', 'Lehenga', 'Kurta', 'Suit', 'Sherwani'];

  useEffect(() => {
    let filtered = [...allProducts];

    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p => 
        p.sizes.some(size => selectedSizes.includes(size))
      );
    }

    filtered = filtered.filter(p => 
      p.price >= priceRange.min && p.price <= priceRange.max
    );

    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.category));
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter(p => {
        const name = p.name.toLowerCase();
        return selectedTypes.some(type => name.includes(type.toLowerCase()));
      });
    }

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
  }, [selectedSizes, priceRange, selectedBrands, selectedTypes, sortBy, allProducts]);

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

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedBrands([]);
    setSelectedTypes([]);
    setPriceRange({ min: 0, max: 10000 });
  };

  return (
    <div className="min-h-screen" style={{ background: '#f3eee7' }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 
            className="text-5xl font-semibold font-heading mb-3"
            style={{ color: '#000000', fontWeight: 600 }}
          >
            Traditional Collection
          </h1>
          <p 
            className="text-base text-gray-600 max-w-2xl mx-auto"
            style={{ letterSpacing: '0.02em' }}
          >
            Authentic & Cultural Heritage Fashion
          </p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>

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

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-black mb-3">Type</h3>
                <div className="space-y-2">
                  {types.map(type => (
                    <label key={type} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleType(type)}
                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                      />
                      <span className="ml-2 text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

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

              <button
                onClick={clearFilters}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          </aside>

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
                  <TraditionalProductCard product={product} />
                </div>
              ))}
              
              {isLoading && (
                <>
                  {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, index) => (
                    <ProductSkeleton key={`skeleton-${index}`} />
                  ))}
                </>
              )}
            </div>
            
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

export default TraditionalCollectionPage;


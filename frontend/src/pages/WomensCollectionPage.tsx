/**
 * Women's Collection Page
 * Modern, premium page showcasing women's fashion products
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, ShoppingCart, Filter, X, Eye, Star } from 'lucide-react';
import { Product } from '../utils/api';
import { useCart } from '../hooks/useCart';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

import { getWomensProducts } from '../services/localJsonService';

// Custom hook to fetch women's products
const useWomensProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const womensProducts = await getWomensProducts();
        if (womensProducts.length === 0) {
          setError('No products found in womens_products.json. Please check if the file exists in the public folder.');
        } else {
          setProducts(womensProducts);
          console.log(`✅ Loaded ${womensProducts.length} women's products from local JSON`);
        }
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products from womens_products.json. Please check if the file exists.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};

interface WomensProductCardProps {
  product: Product;
}

const WomensProductCard: React.FC<WomensProductCardProps> = ({ product }) => {
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
        collection: 'women',
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

  const secondaryImage = product.image.replace('w=600', 'w=601');

  return (
    <div
      className="womens-product-card group relative bg-white overflow-hidden"
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

const ProductSkeleton: React.FC = () => {
  return (
    <div className="womens-product-card bg-white overflow-hidden animate-pulse" style={{ borderRadius: '8px', border: '1px solid #efefef' }}>
      <div className="relative aspect-[3/4] bg-gray-200"></div>
      <div className="p-4">
        <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
};

const WomensCollectionPage: React.FC = () => {
  const { products: allProducts, loading, error } = useWomensProducts();
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

  const brands = Array.from(new Set(allProducts.map(p => p.category)));
  const sizes = ['S', 'M', 'L', 'XL', 'Free Size'];
  const styles = ['Casual', 'Formal', 'Bridal', 'Traditional'];

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

    if (selectedStyles.length > 0) {
      filtered = filtered.filter(p => {
        const name = p.name.toLowerCase();
        if (selectedStyles.includes('Casual') && (name.includes('cotton') || name.includes('kurti') || name.includes('dress'))) {
          return true;
        }
        if (selectedStyles.includes('Formal') && (name.includes('saree') || name.includes('suit'))) {
          return true;
        }
        if (selectedStyles.includes('Bridal') && (name.includes('bridal') || name.includes('lehenga') || name.includes('wedding'))) {
          return true;
        }
        if (selectedStyles.includes('Traditional') && (name.includes('traditional') || name.includes('handloom') || name.includes('bandhani'))) {
          return true;
        }
        return false;
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
  }, [selectedSizes, priceRange, selectedBrands, selectedStyles, sortBy, allProducts]);

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
        <div className="text-center mb-12">
          <h1 
            className="text-5xl font-semibold font-heading mb-3"
            style={{ color: '#000000', fontWeight: 600 }}
          >
            Women's Collection
          </h1>
          <p 
            className="text-base text-gray-600 max-w-2xl mx-auto"
            style={{ letterSpacing: '0.02em' }}
          >
            Elegant & Trendy Styles Curated for Modern Women
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
                  <WomensProductCard product={product} />
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

export default WomensCollectionPage;


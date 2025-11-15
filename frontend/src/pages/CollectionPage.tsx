/**
 * Collection Page
 * Displays a grid of products from JSON data
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../utils/api';
import { localProductsAPI } from '../utils/localApi';
import { useCart } from '../hooks/useCart';
import toast from 'react-hot-toast';

interface CollectionProductCardProps {
  product: Product;
}

const CollectionProductCard: React.FC<CollectionProductCardProps> = ({ product }) => {
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

  const productName = product.title || product.name || 'Product';
  const originalPrice = product.discount 
    ? Math.round(product.price / (1 - product.discount / 100))
    : product.price;
  const inCart = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);
  const secondaryImage = product.imageBack || product.image.replace('w=600', 'w=601');

  return (
    <div
      className="collection-product-card group relative bg-white overflow-hidden"
      style={{
        borderRadius: '8px',
        border: '1px solid #efefef',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={productName}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isHovered ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <img
            src={secondaryImage}
            alt={productName}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {product.discount && product.discount > 0 && (
            <div
              className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold text-white"
              style={{ background: '#000000', borderRadius: '4px' }}
            >
              {product.discount}% OFF
            </div>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              handleWishlist();
            }}
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

          <div
            className={`absolute bottom-0 left-0 right-0 p-4 bg-white transform transition-all duration-300 ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
            style={{ borderTop: '1px solid #efefef' }}
            onClick={(e) => e.preventDefault()}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              disabled={!product.stock || product.stock === 0}
              className="w-full py-3 px-4 text-sm font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: '#000000',
                borderRadius: '4px',
              }}
              onMouseEnter={(e) => {
                if (product.stock && product.stock > 0) {
                  e.currentTarget.style.background = '#d4af37';
                  e.currentTarget.style.color = '#000000';
                }
              }}
              onMouseLeave={(e) => {
                if (product.stock && product.stock > 0) {
                  e.currentTarget.style.background = '#000000';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
            >
              <ShoppingCart className="h-4 w-4" strokeWidth={2} />
              {inCart ? `In Cart (${cartQuantity})` : 'Add to Cart'}
            </button>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
          {product.brand}
        </p>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-black mb-2 line-clamp-2 leading-snug hover:text-gold transition-colors">
            {productName}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-black">
            {formatPrice(product.price)}
          </span>
          {product.discount && product.discount > 0 && (
            <>
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const CollectionPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching products from API...');
        const response = await localProductsAPI.getAllJSON();
        console.log('Products API response:', response);
        
        if (response.success && response.data && response.data.products) {
          console.log('Products loaded:', response.data.products.length);
          setProducts(response.data.products);
        } else {
          console.error('Failed to load products - invalid response:', response);
          setError('Failed to load products. Please check if backend server is running on port 5000.');
        }
      } catch (err: any) {
        console.error('Error fetching products:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          url: err.config?.url
        });
        setError(err.response?.data?.message || err.message || 'Failed to load products. Make sure backend server is running on http://localhost:5000');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f3eee7' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f3eee7' }}>
        <div className="text-center max-w-md px-4">
          <p className="text-red-600 mb-2 font-semibold">{error}</p>
          <p className="text-gray-600 mb-6 text-sm">
            Make sure the backend server is running. Open terminal and run:
            <br />
            <code className="bg-gray-200 px-2 py-1 rounded text-xs">cd backend && npm run dev</code>
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gold transition-colors"
            >
              Retry
            </button>
            <Link
              to="/"
              className="px-6 py-2 border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" style={{ background: '#f3eee7' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1
            className="text-5xl font-bold font-heading mb-3"
            style={{ color: '#000000' }}
          >
            Latest Collection
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium fashion
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="fade-in-up"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'both'
              }}
            >
              <CollectionProductCard product={product} />
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;


/**
 * Wishlist Page Component for VastraVerse
 * Display wishlist items with move to cart and remove functionality
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Eye } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import toast from 'react-hot-toast';

const WishlistPage: React.FC = () => {
  const { items, totalItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const handleMoveToCart = async (productId: number) => {
    try {
      await addToCart(productId);
      removeFromWishlist(productId);
      toast.success('Moved to cart!');
    } catch (error) {
      console.error('Failed to move to cart:', error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-8 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold font-heading text-royalBrown mb-8">My Wishlist</h1>
          
          <div className="text-center py-20">
            <Heart className="h-24 w-24 mx-auto mb-4" style={{ color: '#C49E54' }} />
            <h2 className="text-2xl font-semibold font-heading text-royalBrown mb-4">Your wishlist is empty</h2>
            <p className="text-chocolate mb-8">Save items you love for later!</p>
            <Link 
              to="/products" 
              className="inline-block px-8 py-3 rounded-luxury font-medium transition-all duration-300"
              style={{ background: '#2C1810', color: '#F7F4EF' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#C49E54';
                e.currentTarget.style.color = '#2C1810';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#2C1810';
                e.currentTarget.style.color = '#F7F4EF';
              }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-cream">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-heading text-royalBrown">My Wishlist</h1>
            <p className="text-chocolate mt-2">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
          </div>
          
          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              className="px-4 py-2 rounded-luxury font-medium transition-all duration-300 border-2"
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
              Clear Wishlist
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-luxury-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border"
              style={{ borderColor: '#C49E54', borderWidth: '1px' }}
            >
              {/* Product Image */}
              <div className="relative group">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Remove from Wishlist Button */}
                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors z-10"
                  title="Remove from wishlist"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>

                {/* Stock Badge */}
                {item.stock === 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#C49E54' }}>
                  {item.category}
                </p>
                
                <h3 className="text-lg font-semibold font-heading text-royalBrown mb-2 line-clamp-2">
                  {item.name}
                </h3>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold font-heading" style={{ color: '#8B3A3A' }}>
                    {formatPrice(item.price)}
                  </span>
                  
                  {item.stock !== undefined && item.stock > 0 && (
                    <span className="text-sm text-chocolate">
                      {item.stock} left
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleMoveToCart(item.productId)}
                    disabled={item.stock === 0}
                    className="w-full py-2 px-4 rounded-luxury font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    style={{ background: '#2C1810', color: '#F7F4EF' }}
                    onMouseEnter={(e) => {
                      if (item.stock !== 0) {
                        e.currentTarget.style.background = '#C49E54';
                        e.currentTarget.style.color = '#2C1810';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (item.stock !== 0) {
                        e.currentTarget.style.background = '#2C1810';
                        e.currentTarget.style.color = '#F7F4EF';
                      }
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </button>

                  <Link
                    to={`/products/${item.productId}`}
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;

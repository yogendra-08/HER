/**
 * Wishlist Page Component for VastraVerse
 * Display wishlist items with move to cart and remove functionality
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Eye, ArrowRight } from 'lucide-react';
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
      const item = items.find(i => i.productId === productId);
      if (!item) {
        toast.error('Item not found');
        return;
      }
      
      await addToCart({
        id: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
      });
      removeFromWishlist(productId);
      toast.success(`${item.name} moved to cart!`);
    } catch (error) {
      console.error('Failed to move to cart:', error);
      toast.error('Failed to move to cart');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-16 bg-gradient-to-br from-cream via-sandBeige/50 to-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20 animate-fade-in">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gold/20 rounded-full blur-3xl animate-pulse"></div>
              <Heart className="h-32 w-32 mx-auto relative z-10 text-gold animate-bounce-gentle" fill="currentColor" />
            </div>
            <h2 className="text-4xl font-heading font-bold text-royalBrown mb-4">Your wishlist is empty</h2>
            <p className="text-chocolate text-lg mb-8">Save items you love for later!</p>
            <Link 
              to="/products" 
              className="btn-primary inline-flex items-center space-x-2 group"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-cream via-sandBeige/50 to-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-slide-up">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Heart className="h-8 w-8 text-gold" fill="currentColor" />
              <h1 className="text-4xl font-heading font-bold text-royalBrown">My Wishlist</h1>
            </div>
            <p className="text-chocolate text-lg">{totalItems} {totalItems === 1 ? 'item' : 'items'} saved</p>
          </div>
          
          {items.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your wishlist?')) {
                  clearWishlist();
                }
              }}
              className="btn-outline px-6 py-3"
            >
              Clear Wishlist
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className="bg-white rounded-luxury-lg overflow-hidden shadow-luxury hover:shadow-gold-lg transition-all duration-300 transform hover:scale-[1.02] border border-gold/20 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Product Image */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gold/20 rounded-luxury blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105 relative z-10"
                />
                
                {/* Remove from Wishlist Button */}
                <button
                  onClick={() => {
                    removeFromWishlist(item.productId);
                    toast.success(`${item.name} removed from wishlist`);
                  }}
                  className="absolute top-3 right-3 p-2.5 bg-white rounded-full shadow-lg hover:bg-red-50 transition-all duration-300 z-20 hover:scale-110"
                  title="Remove from wishlist"
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </button>

                {/* Stock Badge */}
                {item.stock === 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1.5 rounded-luxury text-xs font-semibold shadow-md z-20">
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5">
                <p className="text-xs uppercase tracking-wide mb-2 font-medium text-gold">
                  {item.category}
                </p>
                
                <h3 className="text-lg font-heading font-semibold text-royalBrown mb-3 line-clamp-2 hover:text-gold transition-colors">
                  {item.name}
                </h3>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gold/20">
                  <span className="text-2xl font-bold font-heading text-gold">
                    {formatPrice(item.price)}
                  </span>
                  
                  {item.stock !== undefined && item.stock > 0 && (
                    <span className="text-sm text-chocolate bg-sandBeige/50 px-2 py-1 rounded-luxury">
                      {item.stock} left
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleMoveToCart(item.productId)}
                    disabled={item.stock === 0}
                    className="w-full btn-primary py-2.5 px-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-chocolate to-royalBrown opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>

                  <Link
                    to={`/product/${item.productId}`}
                    className="w-full btn-outline py-2.5 px-4 flex items-center justify-center space-x-2 group"
                  >
                    <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>View Details</span>
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

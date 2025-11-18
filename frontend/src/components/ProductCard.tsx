/**
 * Product Card Component for VastraVerse
 * Displays individual product with add to cart and wishlist functionality
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Product } from '../utils/api';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = async () => {
    if (!product.id || !product.price || product.price <= 0) {
      toast.error('Invalid product data. Cannot add to cart.');
      return;
    }
    
    try {
      await addToCart({
        id: product.id,
        name: product.name || product.title || 'Product',
        price: Number(product.price) || 0,
        image: product.image || product.thumbnail || '',
        category: product.category,
        gender: product.gender,
        collection: product.gender === 'women' ? 'women' : product.gender === 'men' ? 'men' : undefined,
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add product to cart');
    }
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: product.id,
      productId: product.id,
      name: product.name || product.title || 'Product',
      price: product.price,
      image: product.image || product.thumbnail || '',
      category: product.category || '',
      stock: product.stock,
    });
  };

  const formatPrice = (price: number | undefined | null) => {
    const validPrice = Number(price) || 0;
    if (isNaN(validPrice) || validPrice <= 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(validPrice);
  };

  const isOutOfStock = (product.stock || 0) === 0;
  const inCart = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id) || 0;
  const inWishlist = isInWishlist(product.id);
  const productPrice = Number(product.price) || 0;

  return (
    <div className="card-product group">
      <div className="relative">
        <img
          src={product.image || product.thumbnail}
          alt={product.name || product.title}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Stock badge */}
        {isOutOfStock && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
            Out of Stock
          </div>
        )}
        
        {/* Wishlist button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        >
          <Heart className={`h-4 w-4 ${
            inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
          }`} />
        </button>

        {/* Quick add to cart overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-luxury font-medium transition-all duration-300"
            style={{ background: '#2C1810', color: '#F7F4EF' }}
            onMouseEnter={(e) => {
              if (!isOutOfStock) {
                e.currentTarget.style.background = '#C49E54';
                e.currentTarget.style.color = '#2C1810';
              }
            }}
            onMouseLeave={(e) => {
              if (!isOutOfStock) {
                e.currentTarget.style.background = '#2C1810';
                e.currentTarget.style.color = '#F7F4EF';
              }
            }}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {inCart && cartQuantity > 0 ? `In Cart (${cartQuantity})` : 'Add to Cart'}
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs font-medium text-gold uppercase tracking-luxury">
            {product.category}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold font-heading text-royalBrown mb-2 line-clamp-2">
          {product.name || product.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.floor(product.rating || 0)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">({product.rating || 0})</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold font-heading text-gold">
              {formatPrice(productPrice)}
            </span>
            {productPrice > 0 && (
              <span className="text-sm text-chocolate line-through opacity-70">
                {formatPrice(productPrice * 1.2)}
              </span>
            )}
          </div>
          
          <div className="text-sm text-chocolate bg-sandBeige/50 px-2 py-1 rounded-luxury">
            {(product.stock || 0) > 0 ? `${product.stock || 0} left` : 'Out of stock'}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex flex-col space-y-2">
          <Link
            to={`/product/${product.id}`}
            className="w-full btn-outline py-2.5 px-4 flex items-center justify-center space-x-2 group"
          >
            <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>View Details</span>
          </Link>
          
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || !product.id || productPrice <= 0}
            className="w-full btn-primary py-2.5 px-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span>{inCart && cartQuantity > 0 ? `In Cart (${cartQuantity})` : 'Add to Cart'}</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-chocolate to-royalBrown opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

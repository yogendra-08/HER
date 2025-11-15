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
    try {
      await addToCart(product.id);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const isOutOfStock = product.stock === 0;
  const inCart = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="card-product group bg-white border" style={{ borderColor: '#C49E54', borderWidth: '1px' }}>
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
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
            {inCart ? `In Cart (${cartQuantity})` : 'Add to Cart'}
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
          {product.name}
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
                  star <= Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">({product.rating})</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold font-heading" style={{ color: '#8B3A3A' }}>
              {formatPrice(product.price)}
            </span>
            {/* Placeholder for original price */}
            <span className="text-sm text-chocolate line-through">
              {formatPrice(product.price * 1.2)}
            </span>
          </div>
          
          <div className="text-sm text-chocolate">
            {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex flex-col space-y-2">
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
              disabled={isOutOfStock}
              className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm py-2 px-4 rounded-luxury font-medium transition-all duration-300"
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
              <ShoppingCart className="h-4 w-4 mr-1 inline" />
              {inCart ? `In Cart (${cartQuantity})` : 'Add to Cart'}
            </button>
            
            <button
              onClick={handleToggleWishlist}
              className="p-2 border rounded-luxury transition-colors"
              style={{ borderColor: '#C49E54' }}
            >
              <Heart className={`h-4 w-4 ${
                inWishlist ? 'fill-red-500 text-red-500' : 'text-gold'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

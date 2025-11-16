/**
 * Featured Product Card Component
 * Luxury modern design inspired by Zara, Myntra, Ajio Luxe
 */

import React, { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../utils/api';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import toast from 'react-hot-toast';

interface FeaturedProductCardProps {
  product: Product;
}

const FeaturedProductCard: React.FC<FeaturedProductCardProps> = ({ product }) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = async () => {
    try {
      await addToCart({
        id: product.id,
        name: product.name || product.title || 'Product',
        price: product.price,
        image: product.image || product.thumbnail || '',
      });
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const originalPrice = Math.round(product.price * 1.3);
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  const inCart = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);
  const inWishlist = isInWishlist(product.id);

  // Generate secondary image (slightly different angle/view) or use a placeholder
  const getImageUrl = (url: string | undefined, isThumbnail = false) => {
    if (!url) return '/placeholder-clothing.jpg'; // Fallback placeholder
    if (isThumbnail && product.thumbnail) return product.thumbnail;
    return url;
  };

  const primaryImage = getImageUrl(product.image || product.thumbnail);
  const secondaryImage = primaryImage.includes('unsplash.com') 
    ? primaryImage.replace('w=600', 'w=601') 
    : primaryImage;

  return (
    <div
      className="featured-product-card group relative bg-white overflow-hidden"
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
          src={primaryImage}
          alt={product.name || 'Fashion product'}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300x400/f5f5f5/999999?text=Product+Image';
            target.onerror = null; // Prevent infinite loop if placeholder also fails
          }}
        />
        
        {/* Secondary Image (reveals on hover) */}
        <img
          src={secondaryImage}
          alt={product.name || 'Fashion product alternate view'}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300x400/f5f5f5/999999?text=Alternate+View';
            target.onerror = null; // Prevent infinite loop if placeholder also fails
          }}
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

        {/* Wishlist Icon */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 z-10"
          style={{ border: '1px solid #efefef' }}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
            strokeWidth={1.5}
          />
        </button>

        {/* Add to Cart Button - Slides up on hover */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 bg-white transform transition-all duration-300 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}
          style={{ borderTop: '1px solid #efefef' }}
        >
          <button
            onClick={handleAddToCart}
            disabled={!product.stock || product.stock === 0}
            className="w-full py-3 px-4 text-sm font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: '#000000',
              borderRadius: '4px',
            }}
            onMouseEnter={(e) => {
              if (product.stock && product.stock > 0) {
                e.currentTarget.style.background = '#d4af37';
              }
            }}
            onMouseLeave={(e) => {
              if (product.stock && product.stock > 0) {
                e.currentTarget.style.background = '#000000';
              }
            }}
          >
            <ShoppingCart className="h-4 w-4" strokeWidth={2} />
            {inCart ? `In Cart (${cartQuantity})` : 'Add to Cart'}
          </button>
        </div>
      </div>

        {/* Product Info */}
      <div className="p-4">
        {/* Brand Name */}
        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
          {product.category.includes("'") ? product.category.split("'")[0].trim() : product.category}
        </p>

        {/* Product Title */}
        <h3 className="text-sm font-medium text-black mb-2 line-clamp-2 leading-snug">
          {product.name || product.title}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-black">
            {formatPrice(product.price)}
          </span>
          {discount > 0 && (
            <>
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
              <span
                className="text-xs font-medium px-1.5 py-0.5 rounded"
                style={{ background: '#efefef', color: '#000000' }}
              >
                Save {formatPrice(originalPrice - product.price)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProductCard;


/**
 * Product Details Page
 * Displays full product information with images, sizes, colors, reviews, and related products
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Product } from '../utils/api';
import { localProductsAPI } from '../utils/localApi';
import { useCart } from '../hooks/useCart';
import toast from 'react-hot-toast';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('Product ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching product with ID:', id);
        const response = await localProductsAPI.getByIdJSON(parseInt(id));
        console.log('Product API response:', response);
        
        if (response.success && response.data && response.data.product) {
          const productData = response.data.product;
          console.log('Product data loaded:', productData);
          setProduct(productData);
          
          // Set default size and color
          if (productData.sizes && productData.sizes.length > 0) {
            setSelectedSize(productData.sizes[0]);
          }
          if (productData.colors && productData.colors.length > 0) {
            setSelectedColor(productData.colors[0].name);
          }

          // Fetch related products
          if (productData.related && productData.related.length > 0) {
            try {
              const relatedPromises = productData.related.map((relatedId: number) =>
                localProductsAPI.getByIdJSON(relatedId)
              );
              const relatedResponses = await Promise.all(relatedPromises);
              const related = relatedResponses
                .filter(res => res.success && res.data)
                .map(res => res.data!.product);
              setRelatedProducts(related);
            } catch (relatedError) {
              console.warn('Error fetching related products:', relatedError);
              // Don't fail the whole page if related products fail
            }
          }
        } else {
          console.error('Product not found in response:', response);
          setError('Product not found');
        }
      } catch (err: any) {
        console.error('Error fetching product:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError(err.response?.data?.message || err.message || 'Failed to load product. Please check if backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (!selectedSize && product.sizes.length > 0) {
      toast.error('Please select a size');
      return;
    }

    try {
      for (let i = 0; i < quantity; i++) {
        await addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        });
      }
      toast.success(`Added ${quantity} item(s) to cart!`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f3eee7' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || (!loading && !product)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f3eee7' }}>
        <div className="text-center max-w-md px-4">
          <p className="text-red-600 mb-2 font-semibold">{error || 'Product not found'}</p>
          <p className="text-gray-600 mb-6 text-sm">
            Make sure the backend server is running on port 5000 and the product ID is correct.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/collection')}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gold transition-colors"
            >
              Back to Collection
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const productName = product.title || product.name || 'Product';
  const originalPrice = product.discount 
    ? Math.round(product.price / (1 - product.discount / 100))
    : product.price;
  const images = [
    product.image,
    product.imageBack || product.image,
    ...(product.colors?.map(c => c.image) || [])
  ].filter(Boolean);
  const inCart = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  return (
    <div className="min-h-screen py-8" style={{ background: '#f3eee7' }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Product Images */}
          <div>
            <div className="relative mb-4" style={{ aspectRatio: '3/4' }}>
              <img
                src={images[selectedImage]}
                alt={productName}
                className="w-full h-full object-cover rounded-lg"
                style={{ borderRadius: '8px' }}
              />
              
              {product.discount && product.discount > 0 && (
                <div
                  className="absolute top-4 left-4 px-3 py-1 text-sm font-semibold text-white"
                  style={{ background: '#000000', borderRadius: '4px' }}
                >
                  {product.discount}% OFF
                </div>
              )}

              <button
                onClick={handleWishlist}
                className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                style={{ border: '1px solid #efefef' }}
              >
                <Heart
                  className={`h-5 w-5 transition-colors ${
                    isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`}
                  strokeWidth={1.5}
                />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-black' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${productName} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">{product.brand}</p>
            <h1 className="text-4xl font-bold mb-4 font-heading" style={{ color: '#000000' }}>
              {productName}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({product.rating})</span>
              {product.reviews && product.reviews.length > 0 && (
                <span className="text-sm text-gray-600">
                  · {product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold" style={{ color: '#000000' }}>
                  {formatPrice(product.price)}
                </span>
                {product.discount && product.discount > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                    <span
                      className="text-sm font-medium px-2 py-1 rounded"
                      style={{ background: '#efefef', color: '#000000' }}
                    >
                      Save {formatPrice(originalPrice - product.price)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </p>
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold mb-2" style={{ color: '#000000' }}>
                  Color: {selectedColor || product.colors[0].name}
                </p>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        setSelectedColor(color.name);
                        const colorIndex = product.colors!.findIndex(c => c.name === color.name);
                        if (colorIndex >= 0 && colorIndex < images.length) {
                          setSelectedImage(colorIndex + 1);
                        }
                      }}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color.name ? 'border-black scale-110' : 'border-gray-300'
                      }`}
                      style={{ background: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold mb-2" style={{ color: '#000000' }}>
                  Size: {selectedSize || 'Select Size'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border-2 rounded-lg transition-all ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-sm font-semibold mb-2" style={{ color: '#000000' }}>
                Quantity
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:border-black transition-colors"
                >
                  -
                </button>
                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:border-black transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 py-4 px-6 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: '#000000', color: '#ffffff' }}
                onMouseEnter={(e) => {
                  if (product.stock > 0) {
                    e.currentTarget.style.background = '#d4af37';
                    e.currentTarget.style.color = '#000000';
                  }
                }}
                onMouseLeave={(e) => {
                  if (product.stock > 0) {
                    e.currentTarget.style.background = '#000000';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
              >
                <ShoppingCart className="h-5 w-5" />
                {inCart ? `In Cart (${cartQuantity})` : 'Add to Cart'}
              </button>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#000000' }}>
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Materials */}
            {product.materials && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#000000' }}>
                  Materials
                </h3>
                <p className="text-gray-600">{product.materials}</p>
              </div>
            )}

            {/* Care Instructions */}
            {product.careInstructions && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#000000' }}>
                  Care Instructions
                </h3>
                <p className="text-gray-600">{product.careInstructions}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 font-heading" style={{ color: '#000000' }}>
              Customer Reviews
            </h2>
            <div className="space-y-6">
              {product.reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white p-6 rounded-lg"
                  style={{ border: '1px solid #efefef' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold" style={{ color: '#000000' }}>
                        {review.user}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 font-heading" style={{ color: '#000000' }}>
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => {
                const relatedName = relatedProduct.title || relatedProduct.name || 'Product';
                return (
                  <Link
                    key={relatedProduct.id}
                    to={`/product/${relatedProduct.id}`}
                    className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                    style={{ border: '1px solid #efefef' }}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={relatedProduct.image}
                        alt={relatedName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                        {relatedProduct.brand}
                      </p>
                      <h3 className="text-sm font-medium mb-2 line-clamp-2" style={{ color: '#000000' }}>
                        {relatedName}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold" style={{ color: '#000000' }}>
                          {formatPrice(relatedProduct.price)}
                        </span>
                        {relatedProduct.discount && relatedProduct.discount > 0 && (
                          <span className="text-xs text-gray-400 line-through">
                            {formatPrice(
                              Math.round(relatedProduct.price / (1 - relatedProduct.discount / 100))
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;


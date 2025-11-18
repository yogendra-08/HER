/**
 * Product Details Page
 * Displays full product information with images, sizes, colors, reviews, and related products
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Product } from '../utils/api';
import { getProductById, getAllProducts } from '../services/localJsonService';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import toast from 'react-hot-toast';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
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
        const productData = await getProductById(parseInt(id));
        console.log('Product data loaded:', productData);
        
        if (productData) {
          setProduct(productData);
          
          // Set default size and color
          if (productData.sizes && productData.sizes.length > 0) {
            setSelectedSize(productData.sizes[0]);
          }
          if (productData.colors && productData.colors.length > 0) {
            setSelectedColor(productData.colors[0].name);
          }

          // Fetch related products (get products from same category)
          try {
            const allProducts = await getAllProducts();
            const related = allProducts
              .filter(p => p.id !== productData.id && 
                      (p.category === productData.category || 
                       p.brand === productData.brand))
              .slice(0, 4); // Get 4 related products
            setRelatedProducts(related);
          } catch (relatedError) {
            console.warn('Error fetching related products:', relatedError);
            // Don't fail the whole page if related products fail
          }
        } else {
          console.error('Product not found');
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
    if (!product) {
      toast.error('Product not available');
      return;
    }

    const productPrice = Number(product.price) || 0;
    if (!product.id || productPrice <= 0) {
      toast.error('Invalid product data. Cannot add to cart.');
      return;
    }

    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      toast.error('Please select a size');
      return;
    }

    if (quantity <= 0 || quantity > 10) {
      toast.error('Please select a valid quantity (1-10)');
      return;
    }

    try {
      await addToCart({
        id: product.id,
        name: product.name || product.title || 'Product',
        price: productPrice,
        image: product.image || product.thumbnail || '',
      }, quantity);
      toast.success(`Added ${quantity} item(s) to cart!`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlist = () => {
    if (!product) return;
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-sandBeige/50 to-cream">
        <div className="text-center animate-fade-in">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gold/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold border-t-transparent mx-auto relative z-10"></div>
          </div>
          <p className="text-chocolate text-lg font-medium">Loading product details...</p>
          <p className="text-chocolate/70 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (error || (!loading && !product)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-sandBeige/50 to-cream">
        <div className="text-center max-w-md px-4 animate-fade-in">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-red-500/10 rounded-full blur-3xl"></div>
            <div className="text-6xl mb-4 relative z-10">😕</div>
          </div>
          <h2 className="text-2xl font-heading font-bold text-royalBrown mb-2">Product Not Found</h2>
          <p className="text-chocolate mb-6">{error || 'The product you are looking for does not exist or has been removed.'}</p>
          <p className="text-chocolate/70 text-sm mb-8">
            Make sure the backend server is running on port 5000 and the product ID is correct.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/products')}
              className="btn-primary px-6 py-3"
            >
              Browse Products
            </button>
            <button
              onClick={() => navigate(-1)}
              className="btn-outline px-6 py-3"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const productName = product.title || product.name || 'Product';
  const productPrice = Number(product?.price) || 0;
  const discount = Number(product?.discount) || 0;
  const originalPrice = discount > 0 && productPrice > 0
    ? Math.round(productPrice / (1 - discount / 100))
    : productPrice;
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
                className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
                style={{ border: '1px solid #efefef' }}
                title={product && isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart
                  className={`h-5 w-5 transition-colors ${
                    product && isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
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
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="text-3xl font-bold text-gold">
                  {formatPrice(productPrice)}
                </span>
                {discount > 0 && originalPrice > productPrice && (
                  <>
                    <span className="text-lg text-chocolate line-through opacity-70">
                      {formatPrice(originalPrice)}
                    </span>
                    <span className="text-sm font-semibold px-3 py-1 rounded-luxury bg-gold/20 text-gold">
                      {discount}% OFF
                    </span>
                    <span className="text-sm font-medium px-3 py-1 rounded-luxury bg-sandBeige/50 text-chocolate">
                      Save {formatPrice(originalPrice - productPrice)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-chocolate bg-sandBeige/30 px-3 py-1 rounded-luxury inline-block">
                {(product.stock || 0) > 0 ? `${product.stock || 0} in stock` : 'Out of stock'}
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
                        <span className="text-base font-semibold text-gold">
                          {formatPrice(Number(relatedProduct.price) || 0)}
                        </span>
                        {relatedProduct.discount && relatedProduct.discount > 0 && (
                          <span className="text-xs text-chocolate line-through opacity-70">
                            {formatPrice(
                              Math.round((Number(relatedProduct.price) || 0) / (1 - (Number(relatedProduct.discount) || 0) / 100))
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


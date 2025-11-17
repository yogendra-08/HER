import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Star, Share2, ChevronRight, ChevronLeft } from 'lucide-react';
import { Product } from '../utils/api';
import { localProductsAPI } from '../utils/localApi';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Fetch all products first
        const allProductsResponse = await localProductsAPI.getAll();
        
        if (allProductsResponse.success && allProductsResponse.data?.products) {
          // Find the product with matching ID
          const foundProduct = allProductsResponse.data.products.find(
            (p: Product) => p.id.toString() === id
          );
          
          if (foundProduct) {
            setProduct(foundProduct);
            setSelectedImage(0);
            
            // Get related products (filter out current product and get random 4)
            const filtered = allProductsResponse.data.products
              .filter((p: Product) => p.id.toString() !== id && p.category === foundProduct.category)
              .sort(() => 0.5 - Math.random())
              .slice(0, 4);
            setRelatedProducts(filtered);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // Add to cart logic here
    alert(`Added ${quantity} ${product?.name} to cart`);
  };

  const handleWishlist = () => {
    // Add to wishlist logic here
    alert('Added to wishlist');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/" 
          className="bg-royalBrown text-white px-6 py-3 rounded-lg hover:bg-gold transition-colors flex items-center"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </div>
    );
  }

  // Create an array of images (using the same image multiple times for demo)
  const productImages = [
    product.image,
    product.thumbnail || product.image,
    product.image,
    product.image
  ].filter(Boolean); // Remove any undefined values

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-gold">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <Link to="/products" className="hover:text-gold">Products</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={productImages[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                  />
                  <button 
                    onClick={() => setSelectedImage(prev => (prev - 1 + productImages.length) % productImages.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => setSelectedImage(prev => (prev + 1) % productImages.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`h-20 rounded-md overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-gold' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="py-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                
                <div className="flex items-center mb-4">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${star <= Math.floor(product.rating || 0) ? 'fill-current' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({Math.floor(Math.random() * 100) + 20} reviews)
                  </span>
                </div>

                <div className="text-3xl font-bold text-gray-900 mb-6">
                  ₹{product.price.toLocaleString()}
                  {product.id % 3 === 0 && (
                    <span className="ml-3 text-sm font-normal text-green-600">
                      In Stock ({product.stock} available)
                    </span>
                  )}
                </div>

                <p className="text-gray-700 mb-8">{product.description}</p>

                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                            selectedSize === size
                              ? 'bg-royalBrown text-white border-royalBrown'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-4 mb-8">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-royalBrown text-white py-3 px-6 rounded-md hover:bg-opacity-90 transition-colors flex items-center justify-center"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleWishlist}
                    className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    aria-label="Add to wishlist"
                  >
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <button className="flex items-center hover:text-gold transition-colors">
                      <Share2 className="h-5 w-5 mr-1" />
                      Share
                    </button>
                    <span>|</span>
                    <div className="flex items-center">
                      <span className="text-green-600 mr-1">✓</span>
                      Free shipping on orders over ₹2000
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Tabs */}
            <div className="border-t border-gray-200">
              <div className="max-w-7xl mx-auto px-4">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    {['Description', 'Details', 'Shipping & Returns', 'Reviews'].map((tab) => (
                      <button
                        key={tab}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          tab === 'Description'
                            ? 'border-gold text-gold'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="py-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Product Description</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-600">
                      {product.description}
                    </p>
                    <p className="mt-4 text-gray-600">
                      Crafted with premium materials and attention to detail, this {product.name} is designed to offer both style and comfort. Perfect for various occasions, it combines modern aesthetics with traditional craftsmanship.
                    </p>
                    <ul className="mt-4 space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Premium quality materials</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Handcrafted with care</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Eco-friendly packaging</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Easy returns within 14 days</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-xl bg-gray-100">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="h-full w-full object-cover object-center group-hover:opacity-75"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      {relatedProduct.name}
                    </h3>
                    <div className="mt-2 flex items-center">
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= Math.floor(relatedProduct.rating || 0) ? 'fill-current' : ''}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">
                        ({Math.floor(Math.random() * 100)})
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      ₹{relatedProduct.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;

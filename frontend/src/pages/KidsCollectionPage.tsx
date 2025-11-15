import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Product } from '../utils/api';
import { useCart } from '../hooks/useCart';
import { getKidsProducts } from '../services/localJsonService';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

// Custom hook to fetch kids' products from local JSON file
const useKidsProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const kidsProducts = await getKidsProducts();
        if (kidsProducts.length === 0) {
          setError('No products found in kids_products.json. Please check if the file exists in the public folder.');
        } else {
          setProducts(kidsProducts);
          console.log(`✅ Loaded ${kidsProducts.length} kids products from local JSON`);
        }
        setHasMore(false);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products from kids_products.json. Please check if the file exists.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    loadMore: () => {},
    hasMore
  };
};

// Product Card Component
const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name || '',
      price: product.price,
      quantity: 1,
      image: product.image || '',
      size: product.sizes?.[0] || 'M',
      product
    });
    toast.success('Added to cart!');
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {isHovered && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Add to Cart
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900">{product.name}</h3>
        <div className="mt-1 flex items-center">
          <Star className="h-4 w-4 text-yellow-400" />
          <span className="ml-1 text-sm text-gray-600">
            {product.rating}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-sm line-through text-gray-500">
              ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Loading Skeleton
const ProductSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-200"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="mt-4 h-6 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

// Main Component
const KidsCollectionPage = () => {
  const { 
    products, 
    loading, 
    error, 
    loadMore, 
    hasMore 
  } = useKidsProducts();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Kids' Collection</h1>
          <p className="mt-2 text-lg text-gray-600">
            Discover our premium collection for the little ones
          </p>
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {loading &&
                Array(4)
                  .fill(0)
                  .map((_, i) => <ProductSkeleton key={i} />)}
            </div>

            {hasMore && !loading && (
              <div className="mt-12 text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default KidsCollectionPage;
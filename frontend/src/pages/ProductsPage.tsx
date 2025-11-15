/**
 * Products Page Component for VastraVerse
 * Display and filter products with luxury theme
 */

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../data/products';
import ProductCard from '../components/ProductCard';

const ProductsPage: React.FC = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchQuery || '');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [isLoading, setIsLoading] = useState(false);
  
  const productsPerPage = 12;

  useEffect(() => {
    const fetchProductsFromJson = async () => {
      try {
        setIsLoading(true);

        const [mensRes, womensRes, kidsRes] = await Promise.all([
          fetch('/mens_products.json'),
          fetch('/womens_products.json'),
          fetch('/kids_products.json'),
        ]);

        if (!mensRes.ok || !womensRes.ok || !kidsRes.ok) {
          throw new Error('Failed to load product JSON files');
        }

        const [mensData, womensData, kidsData] = await Promise.all([
          mensRes.json(),
          womensRes.json(),
          kidsRes.json(),
        ]);

        // Normalize products to ensure all required fields
        const normalizeProducts = (items: any[]): Product[] =>
          items.map((p) => ({
            ...p,
            image: p.image || (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : 'https://via.placeholder.com/400x600?text=No+Image'),
            description: p.description || `${p.brand || ''} ${p.name || 'Product'}`.trim(),
            rating: p.rating || 4.0,
            stock: p.stock !== undefined ? p.stock : 10,
            sizes: p.sizes || ['S', 'M', 'L', 'XL'],
          }));

        const combinedProducts: Product[] = [
          ...normalizeProducts(mensData?.products || []),
          ...normalizeProducts(womensData?.products || []),
          ...normalizeProducts(kidsData?.products || []),
        ];

        console.log('Loaded products:', combinedProducts.length);
        setAllProducts(combinedProducts);
      } catch (error) {
        console.error('Error fetching products from JSON:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductsFromJson();
  }, []);

  useEffect(() => {
    let filtered = allProducts;

    if (category) {
      filtered = allProducts.filter(product =>
        product.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category.toLowerCase())
      );
    }

    filtered = filtered.filter(product =>
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [allProducts, category, searchQuery, selectedCategories, priceRange, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat)
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    );
  };

  const getPageTitle = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (category) return `${category.charAt(0).toUpperCase() + category.slice(1)} Collection`;
    return 'All Products';
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const categories = ['men', 'women', 'kids', 'traditional'];

  return (
    <div className="min-h-screen py-8 bg-cream">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-heading text-royalBrown mb-4">{getPageTitle()}</h1>
          
          {/* Search Bar */}
          <div className="max-w-md">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gold/30 rounded-luxury focus:ring-2 focus:ring-gold focus:border-gold bg-white text-royalBrown"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5" style={{ color: '#8B3A3A' }} />
            </form>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Panel */}
          <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`} style={{ background: '#F7F4EF' }}>
            <div className="p-6 rounded-luxury-lg border border-gold/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-heading" style={{ color: '#8B3A3A' }}>Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-chocolate hover:text-royalBrown"
                >
                  ×
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold font-heading mb-4" style={{ color: '#8B3A3A' }}>Category</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="w-4 h-4 rounded border-2 mr-3 cursor-pointer"
                        style={{ 
                          borderColor: '#C49E54',
                          accentColor: '#C49E54'
                        }}
                      />
                      <span className="text-chocolate group-hover:text-royalBrown transition-colors capitalize">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold font-heading mb-4" style={{ color: '#8B3A3A' }}>Price Range</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-luxury focus:ring-2 focus:ring-gold focus:border-gold bg-white text-royalBrown"
                      style={{ borderColor: '#C49E54' }}
                    />
                    <span className="text-chocolate">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-luxury focus:ring-2 focus:ring-gold focus:border-gold bg-white text-royalBrown"
                      style={{ borderColor: '#C49E54' }}
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setPriceRange({ min: 0, max: 10000 });
                }}
                className="w-full py-2 px-4 rounded-luxury font-medium transition-all duration-300 border-2"
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
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="mb-6 p-4 rounded-luxury-lg flex items-center justify-between flex-wrap gap-4" style={{ background: '#2C1810' }}>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-2 rounded-luxury font-medium transition-all duration-300 border-2"
                  style={{ 
                    borderColor: '#C49E54',
                    color: '#E9E4D4',
                    background: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#C49E54';
                    e.currentTarget.style.color = '#2C1810';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#E9E4D4';
                  }}
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </button>
                <span className="text-sm" style={{ color: '#E9E4D4' }}>
                  {filteredProducts.length} products found
                </span>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-luxury font-medium transition-all duration-300 bg-transparent"
                style={{ 
                  border: '2px solid #C49E54',
                  color: '#E9E4D4',
                  outline: 'none'
                }}
              >
                <option value="featured" style={{ background: '#2C1810', color: '#E9E4D4' }}>Sort by: Featured</option>
                <option value="price-low" style={{ background: '#2C1810', color: '#E9E4D4' }}>Price: Low to High</option>
                <option value="price-high" style={{ background: '#2C1810', color: '#E9E4D4' }}>Price: High to Low</option>
                <option value="newest" style={{ background: '#2C1810', color: '#E9E4D4' }}>Newest First</option>
              </select>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-chocolate text-lg">Loading products...</p>
              </div>
            ) : currentProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ 
                        border: '2px solid #C49E54',
                        color: currentPage === 1 ? '#8B3A3A' : '#C49E54',
                        background: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (currentPage !== 1) {
                          e.currentTarget.style.background = '#C49E54';
                          e.currentTarget.style.color = '#2C1810';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage !== 1) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#C49E54';
                        }
                      }}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className="w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-300"
                            style={{
                              background: currentPage === page ? '#2C1810' : 'transparent',
                              border: '2px solid #C49E54',
                              color: currentPage === page ? '#F7F4EF' : '#C49E54'
                            }}
                            onMouseEnter={(e) => {
                              if (currentPage !== page) {
                                e.currentTarget.style.background = '#C49E54';
                                e.currentTarget.style.color = '#2C1810';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (currentPage !== page) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#C49E54';
                              }
                            }}
                          >
                            {page}
                          </button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="text-gold">...</span>;
                      }
                      return null;
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ 
                        border: '2px solid #C49E54',
                        color: currentPage === totalPages ? '#8B3A3A' : '#C49E54',
                        background: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (currentPage !== totalPages) {
                          e.currentTarget.style.background = '#C49E54';
                          e.currentTarget.style.color = '#2C1810';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage !== totalPages) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#C49E54';
                        }
                      }}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-chocolate text-lg">No products found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

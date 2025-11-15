/**
 * Home Page Component for VastraVerse
 * Landing page with hero section, categories, and featured products
 */

import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag, Heart, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../utils/api';
import { localProductsAPI } from '../utils/localApi';
import FeaturedProductCard from '../components/FeaturedProductCard';

// Placeholder products for testing/design purposes
const placeholderProducts: Product[] = [
    {
      id: 101,
      name: 'Silk Embroidered Saree',
      description: 'Elegant silk saree with intricate zari work and premium fabric',
      price: 3499,
      brand: 'Aria Luxe',
      category: 'Aria Luxe',
      image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop',
      stock: 15,
      rating: 4.8,
      sizes: ['Free Size']
    },
    {
      id: 102,
      name: 'Premium Cotton Hoodie',
      description: 'Comfortable and stylish hoodie perfect for casual wear',
      price: 2499,
      brand: 'Urban Threads',
      category: 'Urban Threads',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop',
      stock: 20,
      rating: 4.6,
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 103,
      name: 'Designer Anarkali Suit',
      description: 'Beautiful floor-length Anarkali with mirror work and embroidery',
      price: 4299,
      brand: 'Ethnic Elegance',
      category: 'Ethnic Elegance',
      image: 'https://images.unsplash.com/photo-1616469829960-18aef209d661?w=600&h=800&fit=crop',
      stock: 12,
      rating: 4.9,
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 104,
      name: 'Classic Denim Jacket',
      description: 'Trendy indigo denim jacket with modern fit and style',
      price: 2999,
      brand: 'Street Style',
      category: 'Street Style',
      image: 'https://images.unsplash.com/photo-1593032465171-8f0b7a0b78cd?w=600&h=800&fit=crop',
      stock: 18,
      rating: 4.5,
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      id: 105,
      name: 'Handloom Cotton Kurta',
      description: 'Traditional handloom kurta with contemporary design',
      price: 1899,
      brand: 'Heritage Craft',
      category: 'Heritage Craft',
      image: 'https://images.unsplash.com/photo-1621786860304-1b1a0a0197a1?w=600&h=800&fit=crop',
      stock: 25,
      rating: 4.7,
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 106,
      name: 'Floral Print Maxi Dress',
      description: 'Elegant maxi dress with beautiful floral patterns',
      price: 2799,
      brand: 'Boho Chic',
      category: 'Boho Chic',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop',
      stock: 14,
      rating: 4.6,
      sizes: ['S', 'M', 'L']
    },
    {
      id: 107,
      name: 'Wool Blend Winter Coat',
      description: 'Warm and stylish winter coat for cold weather',
      price: 5499,
      brand: 'Winter Essentials',
      category: 'Winter Essentials',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
      stock: 10,
      rating: 4.8,
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 108,
      name: 'Chikankari Embroidered Top',
      description: 'Handcrafted chikankari top with delicate embroidery',
      price: 2199,
      brand: 'Artisan Made',
      category: 'Artisan Made',
      image: 'https://images.unsplash.com/photo-1617034182210-91e5336b4999?w=600&h=800&fit=crop',
      stock: 16,
      rating: 4.7,
      sizes: ['S', 'M', 'L', 'XL']
    }
  ];

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [visibleProducts, setVisibleProducts] = useState<Set<number>>(new Set());

  // Luxury clothing brand banner images
  const bannerImages = [
    {
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop',
      title: 'Elegant Traditional Wear',
      subtitle: 'Discover timeless ethnic collections that celebrate Indian heritage'
    },
    {
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop',
      title: 'Bridal & Wedding Collection',
      subtitle: 'Exquisite bridal wear for your special day'
    },
    {
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop',
      title: 'Modern Contemporary Fashion',
      subtitle: 'Where tradition meets contemporary style'
    },
    {
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&h=1080&fit=crop',
      title: 'Handcrafted Artisan Wear',
      subtitle: 'Premium handcrafted clothing with authentic Indian craftsmanship'
    },
    {
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&h=1080&fit=crop',
      title: 'Luxury Fashion Collection',
      subtitle: 'Premium quality fabrics and elegant designs for every occasion'
    }
  ];

  // Auto-rotate banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const goToNextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
  };

  const goToPrevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await localProductsAPI.getAll();
        if (response.success && response.data && response.data.products && response.data.products.length > 0) {
          // Get first 8 products as featured
          setFeaturedProducts(response.data.products.slice(0, 8));
        } else {
          // Use placeholder products if API doesn't return data
          setFeaturedProducts(placeholderProducts.slice(0, 8));
        }
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
        // Use placeholder products on error
        setFeaturedProducts(placeholderProducts.slice(0, 8));
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const productId = parseInt(entry.target.getAttribute('data-product-id') || '0');
            setVisibleProducts((prev) => new Set([...prev, productId]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const productCards = document.querySelectorAll('[data-product-id]');
    productCards.forEach((card) => observer.observe(card));

    return () => {
      productCards.forEach((card) => observer.unobserve(card));
    };
  }, [featuredProducts]);

  const categories = [
    {
      name: 'Men',
      image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=500&fit=crop&q=80',
      link: '/products/men'
    },
    {
      name: 'Women',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop&q=80',
      link: '/products/women'
    },
    {
      name: 'Kids',
      image: 'https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=400&h=500&fit=crop&q=80',
      link: '/products/kids'
    },
    {
      name: 'Sarees',
      image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=500&fit=crop&q=80',
      link: '/products/sarees'
    },
    {
      name: 'Kurtas',
      image: 'https://images.unsplash.com/photo-1621786860304-1b1a0a0197a1?w=400&h=500&fit=crop&q=80',
      link: '/products/kurtas'
    },
    {
      name: 'Ethnic Sets',
      image: 'https://images.unsplash.com/photo-1616469829960-18aef209d661?w=400&h=500&fit=crop&q=80',
      link: '/products/ethnic-sets'
    },
    {
      name: 'T-Shirts',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&q=80',
      link: '/products/t-shirts'
    },
    {
      name: 'Winterwear',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop&q=80',
      link: '/products/winterwear'
    },
    {
      name: 'Hoodies',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop&q=80',
      link: '/products/hoodies'
    }
  ];

  const stats = [
    { icon: Users, value: '50K+', label: 'Happy Customers' },
    { icon: ShoppingBag, value: '10K+', label: 'Products Sold' },
    { icon: Star, value: '4.8', label: 'Average Rating' },
    { icon: Heart, value: '95%', label: 'Customer Satisfaction' },
  ];

  // Trending Brands with actual logo images
  const trendingBrands = [
    { 
      name: 'FabIndia', 
      logo: 'https://logos-world.net/wp-content/uploads/2021/08/Fabindia-Logo.png' 
    },
    { 
      name: 'W for Women', 
      logo: 'https://logos-world.net/wp-content/uploads/2021/08/W-For-Women-Logo.png' 
    },
    { 
      name: 'Biba', 
      logo: 'https://logos-world.net/wp-content/uploads/2021/08/Biba-Logo.png' 
    },
    { 
      name: 'Roadster', 
      logo: 'https://logos-world.net/wp-content/uploads/2021/08/Roadster-Logo.png' 
    },
    { 
      name: 'H&M', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/HM-Logo.png' 
    },
    { 
      name: 'Adidas', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png' 
    },
    { 
      name: 'Nike', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png' 
    },
    { 
      name: 'Wrangler', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Wrangler-Logo.png' 
    },
    { 
      name: "Levi's", 
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Levis-Logo.png' 
    },
    { 
      name: 'Aurelia', 
      logo: 'https://logos-world.net/wp-content/uploads/2021/08/Aurelia-Logo.png' 
    },
    { 
      name: 'Louis Philippe', 
      logo: 'https://logos-world.net/wp-content/uploads/2021/08/Louis-Philippe-Logo.png' 
    },
    { 
      name: 'Van Heusen', 
      logo: 'https://logos-world.net/wp-content/uploads/2021/08/Van-Heusen-Logo.png' 
    },
  ];

  const brandsScrollRef = useRef<HTMLDivElement>(null);

  const scrollBrands = (direction: 'left' | 'right') => {
    if (brandsScrollRef.current) {
      const scrollAmount = 200;
      brandsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner Section with Luxury Animations */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        {/* Banner Images Carousel */}
        <div className="relative w-full h-full">
          {bannerImages.map((banner, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentBannerIndex
                  ? 'opacity-100 scale-100 translate-x-0'
                  : index < currentBannerIndex
                  ? 'opacity-0 scale-95 -translate-x-full'
                  : 'opacity-0 scale-95 translate-x-full'
              }`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center banner-zoom"
                style={{ 
                  backgroundImage: `url(${banner.image})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
                }}
              >
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-royalBrown/90 via-chocolate/80 to-maroon/90"></div>
              </div>
              
              {/* Content */}
              {index === currentBannerIndex && (
                <div className="relative h-full flex items-center justify-center">
                  <div className="text-center px-4 max-w-4xl mx-auto banner-content">
                    <h1 
                      className="text-5xl md:text-7xl font-bold font-heading mb-6 banner-fade-in"
                      style={{ color: '#C49E54' }}
                    >
                      {banner.title}
                    </h1>
                    <p 
                      className="text-xl md:text-2xl mb-4 font-heading banner-slide-up animation-delay-200" 
                      style={{ color: '#E9E4D4' }}
                    >
                      {banner.subtitle}
                    </p>
                    <p 
                      className="text-lg mb-8 opacity-90 max-w-2xl mx-auto banner-fade-in animation-delay-400 text-sandBeige"
                    >
                      Explore the Universe of Indian Fashion - From traditional ethnic wear to modern contemporary styles, 
                      discover clothing that celebrates your unique style and heritage.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center banner-slide-up animation-delay-600">
                      <Link 
                        to="/summer-collection" 
                        className="inline-flex items-center px-8 py-4 rounded-luxury font-medium transition-all duration-300 shadow-gold hover:shadow-gold-lg transform hover:scale-[1.02] tracking-elegant"
                        style={{ background: '#C49E54', color: '#2C1810' }}
                      >
                        Shop Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                      <Link 
                        to="/products/traditional" 
                        className="inline-flex items-center px-8 py-4 rounded-luxury font-medium transition-all duration-300 border-2 tracking-elegant"
                        style={{ borderColor: '#C49E54', color: '#C49E54', background: 'transparent' }}
                      >
                        Explore Traditional
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevBanner}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 border border-gold/30 hover:border-gold"
          aria-label="Previous banner"
        >
          <ChevronLeft className="h-6 w-6 text-gold" strokeWidth={2} />
        </button>
        <button
          onClick={goToNextBanner}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 border border-gold/30 hover:border-gold"
          aria-label="Next banner"
        >
          <ChevronRight className="h-6 w-6 text-gold" strokeWidth={2} />
        </button>

        {/* Banner Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBannerIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentBannerIndex
                  ? 'w-8 bg-gold'
                  : 'w-2 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Categories Section - Modern Minimal Style */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-heading text-royalBrown mb-4">Shop by Category</h2>
            <p className="text-lg text-chocolate max-w-2xl mx-auto">
              Discover our curated collections designed for every style and occasion
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="category-tile group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-500"
              >
                <div className="relative h-64 md:h-72">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  
                  {/* Black transparent overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500"></div>
                  
                  {/* Text overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white text-lg font-medium group-hover:font-bold transition-all duration-300">
                        {category.name}
                      </h3>
                      <ArrowRight className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300" strokeWidth={2} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Brands Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold font-heading mb-4" style={{ fontWeight: 600, color: '#2C1810' }}>
              Trending Brands
            </h2>
          </div>

          {/* Brands Slider Container */}
          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={() => scrollBrands('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-lg hover:shadow-xl hover:border-gold/50 transition-all duration-200 flex items-center justify-center group"
              aria-label="Scroll brands left"
            >
              <ChevronLeft className="h-5 w-5 text-chocolate group-hover:text-gold transition-colors" strokeWidth={2} />
            </button>

            {/* Brands Scroll Container */}
            <div
              ref={brandsScrollRef}
              className="flex gap-5 overflow-x-auto scrollbar-hide px-10 py-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                scrollBehavior: 'smooth'
              }}
            >
              {trendingBrands.map((brand, index) => (
                <div
                  key={index}
                  className="brand-card group flex-shrink-0 flex items-center justify-center cursor-pointer transition-all duration-200"
                  style={{
                    width: '140px',
                    height: '90px',
                    borderRadius: '20px',
                    border: '1px solid #eaeaea',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    background: '#FFFFFF'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                  }}
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-w-[100px] max-h-[60px] object-contain filter grayscale-0 opacity-90 group-hover:opacity-100 transition-opacity duration-200"
                    onError={(e) => {
                      // Fallback to text if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.brand-fallback')) {
                        const fallback = document.createElement('div');
                        fallback.className = 'brand-fallback text-chocolate font-semibold text-sm text-center px-2';
                        fallback.textContent = brand.name;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scrollBrands('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-lg hover:shadow-xl hover:border-gold/50 transition-all duration-200 flex items-center justify-center group"
              aria-label="Scroll brands right"
            >
              <ChevronRight className="h-5 w-5 text-chocolate group-hover:text-gold transition-colors" strokeWidth={2} />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products Section - Luxury Modern Design */}
      <section className="py-20" style={{ background: '#f3eee7' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 
              className="text-5xl font-semibold font-heading mb-3"
              style={{ color: '#000000', fontWeight: 600 }}
            >
              Featured
            </h2>
            <p 
              className="text-base text-gray-600 max-w-2xl mx-auto mb-6"
              style={{ letterSpacing: '0.02em' }}
            >
              Premium handpicked styles for you
            </p>
            <Link
              to="/collection"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300"
              style={{
                background: '#000000',
                color: '#ffffff'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#d4af37';
                e.currentTarget.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#000000';
                e.currentTarget.style.color = '#ffffff';
              }}
            >
              View Full Collection
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="loading-spinner"></div>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600">No featured products available at the moment.</p>
            </div>
          ) : (
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  data-product-id={product.id}
                  className={`fade-in-up ${visibleProducts.has(product.id) ? 'visible' : ''}`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <FeaturedProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link 
              to="/products" 
              className="inline-flex items-center px-8 py-3 text-sm font-medium text-black transition-all duration-300 border-b-2 border-transparent hover:border-black"
              style={{ letterSpacing: '0.05em' }}
            >
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white rounded-luxury-lg p-6 shadow-gold border border-gold/20">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                  <stat.icon className="h-8 w-8" style={{ color: '#C49E54' }} />
                </div>
                <div className="text-3xl font-bold mb-2" style={{ color: '#8B3A3A' }}>{stat.value}</div>
                <div className="text-chocolate">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section 
        className="py-20 text-white relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(44, 24, 16, 0.95), rgba(74, 46, 41, 0.95), rgba(139, 58, 58, 0.95)), url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=600&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-4 font-heading">Stay Updated with VastraVerse</h2>
          <p className="text-xl mb-8 opacity-90">
            Get the latest fashion trends, exclusive offers, and style tips delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-4 rounded-luxury text-royalBrown focus:ring-2 focus:ring-gold focus:outline-none bg-cream border border-gold/30"
            />
            <button className="bg-gold text-royalBrown px-8 py-4 rounded-luxury font-medium hover:bg-gold-light transition-colors shadow-gold tracking-elegant">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

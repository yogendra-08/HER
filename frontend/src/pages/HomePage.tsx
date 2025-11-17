/**
 * Home Page Component for VastraVerse
 * Landing page with hero section, categories, and featured products
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag, Heart, Users, ChevronLeft, ChevronRight, ArrowUp, Eye, ShoppingCart } from 'lucide-react';
import { Product } from '../utils/api';
import { localProductsAPI } from '../utils/localApi';
// Import removed as it's not being used

// Premium products collection
const premiumProducts: Product[] = [
  {
    id: 1001,
    name: 'Luxury Silk Saree',
    description: 'Handwoven Banarasi silk saree with pure zari work',
    price: 12999,
    brand: 'Royal Weaves',
    category: 'Premium',
    image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8c663?w=600&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8c663?w=300&h=400&fit=crop',
    stock: 8,
    rating: 4.9,
    sizes: ['Free Size']
  },
  {
    id: 1002,
    name: 'Designer Tuxedo Suit',
    description: 'Premium Italian wool tuxedo with satin lapels',
    price: 34999,
    brand: 'Elite Tailors',
    category: 'Premium',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=400&fit=crop',
    stock: 5,
    rating: 5.0,
    sizes: ['M', 'L', 'XL']
  },
  {
    id: 1003,
    name: 'Hand-Embroidered Lehenga',
    description: 'Bridal lehenga with intricate hand embroidery',
    price: 45999,
    brand: 'Heritage Couture',
    category: 'Premium',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=300&h=400&fit=crop',
    stock: 3,
    rating: 4.9,
    sizes: ['S', 'M', 'L']
  },
  {
    id: 1004,
    name: 'Cashmere Overcoat',
    description: '100% Pure Cashmere winter overcoat',
    price: 38999,
    brand: 'Luxury Wraps',
    category: 'Premium',
    image: 'https://images.unsplash.com/photo-1551028719-001e990e9c5d?w=600&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1551028719-001e990e9c5d?w=300&h=400&fit=crop',
    stock: 6,
    rating: 4.8,
    sizes: ['M', 'L', 'XL']
  },
];

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
    thumbnail: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=300&h=400&fit=crop',
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
    thumbnail: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=400&fit=crop',
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
    thumbnail: 'https://images.unsplash.com/photo-1616469829960-18aef209d661?w=300&h=400&fit=crop',
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
  const [showScroll, setShowScroll] = useState(false);
  const [, setHoveredProduct] = useState<number | null>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  const checkScrollTop = useCallback(() => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  }, [showScroll]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [checkScrollTop]);

  useEffect(() => {
    const handleScroll = () => {
      setParallaxOffset(window.pageYOffset * 0.3);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
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
      image: 'https://cdn.thecoolist.com/wp-content/uploads/2017/08/How-to-dress-for-your-body-type.jpg',
      link: '/products/men'
    },
    {
      name: 'Women',
      image: 'https://cdn.shopify.com/s/files/1/1746/5485/files/1_7a6c4c07-a4d7-4299-b90a-c4a8825bf8d9_540x.jpg?v=1742403363',
      link: '/products/women'
    },
    {
      name: 'Kids',
      image: 'https://img.lazcdn.com/g/ff/kf/Sb04d45722db141e0acc9942985210aa1v.jpg_720x720q80.jpg',
      link: '/products/kids'
    },
    {
      name: 'Sarees',
      image: 'https://rimzimfashion.com/cdn/shop/files/30.webp?v=1726117571',
      link: '/products/sarees'
    },
    {
      name: 'Kurtas',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScCUUUXIFZNoWRlUsdhFgZSkGRCVhmgeQq96QFuKi47wVj1fokXY3ycScm3nD2Zl5E4NI&usqp=CAU',
      link: '/products/kurtas'
    },
    {
      name: 'Ethnic Sets',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=1000&fit=crop&q=80',
      link: '/products/ethnic-sets'
    },
    {
      name: 'T-Shirts',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=80',
      link: '/products/t-shirts'
    },
    {
      name: 'Winterwear',
      image: 'https://www.instyle.com/thmb/LnlUK5oZbdqPqvcAgRQ7Jc1Axw4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-2117544782-a48b916b48854f3a8e459745b34fbf4e.jpg',
      link: '/products/winterwear'
    },
    {
      name: 'Hoodies',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGKJWudmmKe5m6QzdZELR0Ti0u0KiNjrRbUQ&',
      link: '/products/hoodies'
    }
  ];

  const stats = [
    { icon: Users, value: '50K+', label: 'Happy Customers' },
    { icon: ShoppingBag, value: '10K+', label: 'Products Sold' },
    { icon: Star, value: '4.8', label: 'Average Rating' },
    { icon: Heart, value: '95%', label: 'Customer Satisfaction' },
  ];

  // Trending Brands with high-quality logo images
  const trendingBrands = [
    { 
      name: 'Nike', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png' 
    },
    { 
      name: 'Adidas', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/2560px-Adidas_Logo.svg.png' 
    },
    { 
      name: 'Zara', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Zara_Logo.png/1024px-Zara_Logo.png' 
    },
    { 
      name: 'H&M', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/1200px-H%26M-Logo.svg.png' 
    },
    { 
      name: 'Levi\'s', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Levi%27s_logo.svg/1024px-Levi%27s_logo.svg.png' 
    },
    { 
      name: 'Puma', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Puma_logo.svg/1024px-Puma_logo.svg.png' 
    },
    { 
      name: 'Gucci', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Gucci_Logo.svg/1024px-Gucci_Logo.svg.png' 
    },
    { 
      name: 'Tommy Hilfiger', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Tommy_Hilfiger_Logo.svg/1024px-Tommy_Hilfiger_Logo.svg.png' 
    },
    { 
      name: 'FabIndia', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Fabindia_logo.svg/1200px-Fabindia_logo.svg.png' 
    },
    { 
      name: 'Biba', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/BIBA_logo.png/1200px-BIBA_logo.png' 
    }
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

  // Back to Top Button
  const BackToTop = () => (
    <button
      onClick={scrollTop}
      className={`fixed bottom-8 right-8 z-50 p-3 rounded-full bg-gold text-royalBrown shadow-lg hover:shadow-xl transition-all duration-300 transform ${
        showScroll ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      aria-label="Back to top"
    >
      <ArrowUp className="h-6 w-6" />
    </button>
  );

  return (
    <div className="min-h-screen relative">
      <BackToTop />
      {/* Hero Banner Section with Parallax Effect */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        {/* Parallax Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out"
          style={{
            backgroundImage: `url(${bannerImages[currentBannerIndex].image})`,
            transform: `translateY(${parallaxOffset * 0.3}px)`,
            willChange: 'transform'
          }}
        >
          <div className="absolute inset-0 backdrop-blur-sm bg-black/30"></div>
        </div>
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
                    <div className="flex flex-col sm:flex-row gap-4 justify-center banner-slide-up animation-delay-600 relative z-10">
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
              {featuredProducts.map((product) => (
                <Link 
                  to={`/product/${product.id}`}
                  key={product.id}
                  className={`product-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 ease-out block ${
                    visibleProducts.has(product.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Product Badge */}
                  {product.id % 3 === 0 && <span className="product-badge">Bestseller</span>}
                  {product.id % 5 === 0 && <span className="product-badge" style={{background: '#EF4444'}}>Sale</span>}
                  
                  {/* Product Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                    />
                    
                    {/* Quick Actions */}
                    <div className="product-actions absolute bottom-0 left-0 right-0 bg-white/90 p-3 flex justify-center space-x-2">
                      <button className="p-2 rounded-full bg-white hover:bg-gray-100 text-gray-700 hover:text-gold transition-colors">
                        <Heart className="h-5 w-5" />
                      </button>
                      <button className="p-2 rounded-full bg-white hover:bg-gray-100 text-gray-700 hover:text-gold transition-colors">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button className="p-2 rounded-full bg-royalBrown text-white hover:bg-gold transition-colors flex items-center">
                        <ShoppingCart className="h-5 w-5 mr-1" />
                        <span className="text-sm">Add to Cart</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{product.price.toLocaleString()}</p>
                        <div className="flex items-center justify-end mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Color Swatches */}
                    <div className="mt-3 flex space-x-2">
                      {['#000000', '#3B82F6', '#EF4444', '#F59E0B'].map((color, i) => (
                        <button
                          key={i}
                          className="w-5 h-5 rounded-full border border-gray-200"
                          style={{ backgroundColor: color }}
                          aria-label={`Color ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </Link>
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

      {/* Premium Collection Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-royalBrown mb-4">Our Premium Collection</h2>
            <div className="w-24 h-1 bg-gold mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Exquisite craftsmanship meets timeless elegance in our premium collection. Each piece is meticulously designed for those who appreciate the finer things in life.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {premiumProducts.map((product) => (
              <Link 
                to={`/product/${product.id}`}
                key={product.id}
                className="product-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 ease-out block"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-80 object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-royalBrown text-white text-xs font-semibold px-2 py-1 rounded">
                    Premium
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.brand}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{product.price.toLocaleString()}</p>
                      <div className="flex items-center justify-end mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/products?category=premium" 
              className="inline-flex items-center px-8 py-3 text-sm font-medium text-royalBrown transition-all duration-300 border-b-2 border-transparent hover:border-royalBrown"
              style={{ letterSpacing: '0.05em' }}
            >
              View All Premium Products
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

      {/* Why Choose VastraVerse Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose VastraVerse?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Experience the perfect blend of style, comfort, and quality in every piece we create.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden">
              <div className="w-full h-48 overflow-hidden">
                <img 
                  src="/feedback/img2.png" 
                  alt="Elevate Your Everyday" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Designed to Elevate Your Everyday</h3>
                <p className="text-gray-600">Our collections blend style and comfort, helping customers feel confident every day.</p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden">
              <div className="w-full h-48 overflow-hidden">
                <img 
                  src="/feedback/img1.png" 
                  alt="Comfort That Moves With You" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Comfort That Moves With You</h3>
                <p className="text-gray-600">Premium, skin-friendly fabrics designed to keep users relaxed and active.</p>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden">
              <div className="w-full h-48 overflow-hidden">
                <img 
                  src="/feedback/img3.png" 
                  alt="Timeless Style, Modern Touch" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Timeless Style, Modern Touch</h3>
                <p className="text-gray-600">A mix of classic silhouettes with contemporary details for a fresh, meaningful wardrobe.</p>
              </div>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden">
              <div className="w-full h-48 overflow-hidden">
                <img 
                  src="/feedback/img4.png" 
                  alt="Crafted With Purpose" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Crafted With Purpose</h3>
                <p className="text-gray-600">Every piece is created with thoughtful craftsmanship and attention to detail.</p>
              </div>
            </div>

            {/* Feature Card 5 */}
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden">
              <div className="w-full h-48 overflow-hidden">
                <img 
                  src="/feedback/img5.png" 
                  alt="Your Style, Your Identity" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Style, Your Identity</h3>
                <p className="text-gray-600">Fashion that reflects the customer's personality — bold, minimal, or experimental.</p>
              </div>
            </div>

            {/* Feature Card 6 */}
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden">
              <div className="w-full h-48 overflow-hidden">
                <img 
                  src="/feedback/img6.png" 
                  alt="Made for Real Life" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Made for Real Life</h3>
                <p className="text-gray-600">Clothing that is durable, versatile, and perfect for everyday use.</p>
              </div>
            </div>
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

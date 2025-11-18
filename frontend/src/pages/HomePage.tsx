/**
 * Home Page Component for VastraVerse
 * Landing page with hero section, categories, and featured products
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShoppingBag, Heart, Users, ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react';
import { Product } from '../utils/api';

type PremiumProduct = Product & {
  fallbackImage: string;
  customPlaceholder: string;
};

const HomePage: React.FC = () => {
  const [showScroll, setShowScroll] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [premiumProducts, setPremiumProducts] = useState<PremiumProduct[]>([]);
  const [premiumLoading, setPremiumLoading] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerRef = useRef<HTMLDivElement>(null);

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

  const luxuryFallbackImages = [
    'https://waliajones.com/cdn/shop/files/DSC03062.webp?v=1699471091 w=900&h=1200&fit=crop&q=80',
    'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=900&h=1200&fit=crop&q=80',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&h=1200&fit=crop&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&h=1200&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&h=1200&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=900&h=1200&fit=crop&q=80'
  ];

  const PREMIUM_IMAGE_BASE_PATH = '/custom-premium-images';

  // Auto-rotate banner with pause on hover
  useEffect(() => {
    const bannerElement = bannerRef.current;
    let interval: NodeJS.Timeout;

    const startInterval = () => {
      interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
      }, 5000);
    };

    const pauseInterval = () => {
      clearInterval(interval);
    };

    startInterval();

    if (bannerElement) {
      bannerElement.addEventListener('mouseenter', pauseInterval);
      bannerElement.addEventListener('mouseleave', startInterval);
    }

    return () => {
      clearInterval(interval);
      if (bannerElement) {
        bannerElement.removeEventListener('mouseenter', pauseInterval);
        bannerElement.removeEventListener('mouseleave', startInterval);
      }
    };
  }, [bannerImages.length]);

  const goToNextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
  };

  const goToPrevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  useEffect(() => {
    const fetchPremiumProducts = async () => {
      try {
        const response = await fetch('/branded-style.json');
        if (!response.ok) {
          throw new Error('Failed to fetch premium collection');
        }
        const data = await response.json();
        if (data?.products?.length) {
          const normalized: PremiumProduct[] = data.products.slice(0, 8).map((item: any, index: number) => {
            const customPlaceholder = `${PREMIUM_IMAGE_BASE_PATH}/premium-${index + 1}.jpg`;
            const fallbackImage = item.image || item.images?.[0] || luxuryFallbackImages[index % luxuryFallbackImages.length];
            const imageSource = customPlaceholder;
            const descriptionText = item.description || item.display_categories || 'Premium curated piece';
            const price = Number(item.price ?? item.discounted_price ?? 0);
            return {
              id: item.id ?? index,
              name: item.name ?? item.display_categories ?? 'Premium Product',
              description: descriptionText,
              price,
              brand: item.brand ?? 'Luxury Label',
              category: item.category ?? item.display_categories ?? 'Premium',
              image: imageSource,
              thumbnail: imageSource,
              fallbackImage,
              customPlaceholder,
              stock: item.stock ?? 0,
              rating: Number(item.rating) || 4.5,
            } as PremiumProduct;
          });
          setPremiumProducts(normalized);
        } else {
          setPremiumProducts([]);
        }
      } catch (error) {
        console.error('Failed to load premium collection:', error);
        setPremiumProducts([]);
      } finally {
        setPremiumLoading(false);
      }
    };

    fetchPremiumProducts();
  }, []);

  const CATEGORY_IMAGE_BASE_PATH = '/custom-category-images';

  const categoryConfigs = [
    {
      name: 'Men',
      slug: 'men',
      fallback: 'https://cdn.thecoolist.com/wp-content/uploads/2017/08/How-to-dress-for-your-body-type.jpg',
      link: '/products/men'
    },
    {
      name: 'Women',
      slug: 'women',
      fallback: 'https://cdn.shopify.com/s/files/1/1746/5485/files/1_7a6c4c07-a4d7-4299-b90a-c4a8825bf8d9_540x.jpg?v=1742403363',
      link: '/products/women'
    },
    {
      name: 'Kids',
      slug: 'kids',
      fallback: 'https://img.lazcdn.com/g/ff/kf/Sb04d45722db141e0acc9942985210aa1v.jpg_720x720q80.jpg',
      link: '/products/kids'
    },
    {
      name: 'Sarees',
      slug: 'sarees',
      fallback: 'https://rimzimfashion.com/cdn/shop/files/30.webp?v=1726117571',
      link: '/products/sarees'
    },
    {
      name: 'Kurtas',
      slug: 'kurtas',
      fallback: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScCUUUXIFZNoWRlUsdhFgZSkGRCVhmgeQq96QFuKi47wVj1fokXY3ycScm3nD2Zl5E4NI&usqp=CAU',
      link: '/products/kurtas'
    },
    {
      name: 'Ethnic Sets',
      slug: 'ethnic-sets',
      fallback: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=1000&fit=crop&q=80',
      link: '/products/ethnic-sets'
    },
    {
      name: 'T-Shirts',
      slug: 't-shirts',
      fallback: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=80',
      link: '/products/t-shirts'
    },
    {
      name: 'Winterwear',
      slug: 'winterwear',
      fallback: 'https://www.instyle.com/thmb/LnlUK5oZbdqPqvcAgRQ7Jc1Axw4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-2117544782-a48b916b48854f3a8e459745b34fbf4e.jpg',
      link: '/products/winterwear'
    },
    {
      name: 'Hoodies',
      slug: 'hoodies',
      fallback: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGKJWudmmKe5m6QzdZELR0Ti0u0KiNjrRbUQ&',
      link: '/products/hoodies'
    }
  ];

  const categories = categoryConfigs.map((category) => ({
    ...category,
    image: `${CATEGORY_IMAGE_BASE_PATH}/${category.slug}.jpg`,
  }));

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

  const marqueeBrands = [...trendingBrands, ...trendingBrands];

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
    <div className="min-h-screen relative bg-gradient-to-b from-royalBrown/5 to-cream/30">
      <BackToTop />
      {/* Hero Banner Section with Parallax Effect */}
      <section className="relative h-[600px] md:h-[80vh] min-h-[600px] max-h-[900px] overflow-hidden">
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
                <div className="relative h-full flex items-center justify-center px-4">
                  <div className="text-center max-w-5xl mx-auto banner-content">
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading mb-6"
                      style={{ 
                        color: '#C49E54',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                      }}
                    >
                      {banner.title}
                    </motion.h1>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                      className="text-xl md:text-2xl mb-6 font-medium font-heading" 
                      style={{ 
                        color: '#F8F5EE',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                      }}
                    >
                      {banner.subtitle}
                    </motion.p>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                      className="text-lg mb-8 opacity-95 max-w-2xl mx-auto text-sandBeige/90 leading-relaxed"
                      style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
                    >
                      Explore the Universe of Indian Fashion - From traditional ethnic wear to modern contemporary styles, 
                      discover clothing that celebrates your unique style and heritage.
                    </motion.p>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                      className="flex flex-col sm:flex-row gap-4 justify-center relative z-10"
                    >
                      <Link 
                        to="/summer-collection" 
                        className="group inline-flex items-center px-8 py-4 rounded-luxury font-medium transition-all duration-300 hover:shadow-gold-lg transform hover:scale-[1.02] tracking-wider"
                        style={{ 
                          background: '#C49E54', 
                          color: '#2C1810',
                          boxShadow: '0 4px 20px -5px rgba(196, 158, 84, 0.4)'
                        }}
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          Shop Now
                        </span>
                        <ArrowRight className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                      <Link 
                        to="/products/traditional" 
                        className="group inline-flex items-center px-8 py-4 rounded-luxury font-medium transition-all duration-300 border-2 tracking-wider hover:bg-gold/10"
                        style={{ 
                          borderColor: '#C49E54', 
                          color: '#F8F5EE',
                          backdropFilter: 'blur(4px)'
                        }}
                      >
                        <span>Explore Traditional</span>
                        <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      </Link>
                    </motion.div>
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
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[#FBFBFA] via-[#C4C1B8] to-[#C7BDAA]">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -top-32 -right-20 w-72 h-72 bg-white/50 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#C7BDAA]/40 blur-[120px] rounded-full"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-gold font-medium mb-3 tracking-wider">OUR COLLECTIONS</span>
            <h2 className="text-4xl font-bold font-heading text-royalBrown mb-4">Shop by Category</h2>
            <div className="w-20 h-1 bg-gold mx-auto mb-6"></div>
            <p className="text-lg text-chocolate/90 max-w-2xl mx-auto leading-relaxed">
              Discover our curated collections designed for every style and occasion. Find the perfect outfit that matches your unique personality.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6 px-4 sm:px-6">
            {categories.map((category, index) => {
              const midpoint = Math.ceil(categories.length / 2);
              const isTopRow = index < midpoint;
              const hoverShiftClass = isTopRow ? 'lg:hover:translate-x-3' : 'lg:hover:-translate-x-3';
              const initialMotion = {
                opacity: 0,
                x: isTopRow ? -40 : 40,
                y: 10,
              };

              return (
              <motion.div 
                key={index}
                initial={initialMotion}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.05, ease: 'easeOut' }}
                className="h-full"
              >
                <Link
                  to={category.link}
                  className={`category-tile group relative block h-full overflow-hidden rounded-[18px] shadow-[0_20px_40px_rgba(60,48,31,0.12)] hover:shadow-[0_30px_60px_rgba(60,48,31,0.2)] transition-all duration-500 hover:scale-[1.03] ${hoverShiftClass}`}
                >
                  <div className="relative h-64 md:h-80 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10"></div>
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== category.fallback) {
                          target.src = category.fallback;
                        }
                      }}
                    />
                    
                    {/* Text overlay */}
                    <div className="absolute bottom-0 left-0 right-0 z-20 p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-white group-hover:text-gold transition-colors duration-300">
                          {category.name}
                        </h3>
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gold/90 text-royalBrown transform -translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                          <ArrowRight className="h-4 w-4" strokeWidth={3} />
                        </div>
                      </div>
                      <div className="h-0.5 w-8 bg-gold mt-2 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"></div>
                    </div>
                    
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>
                </Link>
              </motion.div>
            );
            })}
          </div>
        </div>
      </section>

      {/* Trending Brands Section */}
      <section className="relative py-28 lg:py-32 bg-gradient-to-b from-[#FBFBFA] via-[#C7BDAA] to-[#3B332B] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-40 bg-white/30 blur-[120px]"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#3B332B]/40 blur-[140px]"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block text-[#F8F5EE] font-semibold tracking-[0.35em] mb-4 text-sm uppercase">Prestige Partners</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-[#1F150D] mb-4">Trending Luxury Brands</h2>
            <p className="text-lg text-[#2C1810]/90 leading-relaxed">
              Hand-picked global houses and Indian couture labels that define contemporary opulence. Experience a seamless blend of heritage and innovation.
            </p>
          </motion.div>

          <div className="relative mt-16">
            <div className="brands-marquee-mask">
              <div className="brands-marquee-track">
                {marqueeBrands.map((brand, index) => (
                  <div
                    key={`${brand.name}-${index}`}
                    className="brand-marquee-card shadow-[0_18px_45px_rgba(59,51,43,0.18)]"
                  >
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-w-[120px] max-h-[60px] object-contain opacity-90"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.brand-fallback')) {
                          const fallback = document.createElement('div');
                          fallback.className = 'brand-fallback text-[#3B332B] font-semibold text-sm text-center px-4';
                          fallback.textContent = brand.name;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Collection Section */}
      <section className="relative py-20 lg:py-24 premium-gradient-bg overflow-hidden">
        <div className="premium-noise-overlay"></div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-56 h-56 bg-white/20 blur-[140px]"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#3A332C]/30 blur-[160px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-[#271C14] mb-4">Our Premium Collection</h2>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-[#D6C7A1] via-[#C4B285] to-[#B08B5B]"></div>
            <p className="text-[#4A3F37] mt-5 max-w-2xl mx-auto text-lg leading-relaxed">
              Exquisite craftsmanship meets timeless elegance. Discover curated pieces finished with couture-level detailing for those who appreciate the finer things in life.
            </p>
          </div>
          
          {premiumLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="loading-spinner"></div>
            </div>
          ) : premiumProducts.length === 0 ? (
            <div className="text-center text-[#4A3F37] py-16">
              Premium collection is being curated. Please check back soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {premiumProducts.map((product, index) => {
                return (
                <Link 
                  to={`/product/${product.id}`}
                  key={product.id}
                  className="product-card premium-card bg-white/95 border border-[#F1E5D0]/70 rounded-2xl overflow-hidden shadow-[0_25px_65px_rgba(58,51,44,0.18)] block"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="relative h-72 overflow-hidden">
                    <img 
                      src={product.image || product.customPlaceholder}
                      alt={product.name}
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (product.fallbackImage && target.src !== product.fallbackImage) {
                          target.src = product.fallbackImage;
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1F160F]/35 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <p className="uppercase tracking-[0.35em] text-xs text-[#B08B5B] mb-3">{product.brand || 'Signature'}</p>
                    <h3 className="text-2xl font-semibold text-[#2C1810] mb-2">{product.name}</h3>
                    <p className="text-[#5C4A3E] text-sm mb-5 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-[#B08B5B]">
                        ₹{product.price}
                      </span>
                      <button className="px-4 py-2 rounded-full text-sm font-medium text-[#2C1810] border border-[#D6C7A1] bg-white/80 backdrop-blur-sm hover:bg-[#D6C7A1] hover:text-[#2C1810] transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </Link>
              );
              })}
            </div>
          )}
          
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
      <section className="py-20 bg-gradient-to-b from-[#F7F3ED] via-[#E5D8C3] to-[#D1BFA3]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white/90 rounded-luxury-lg p-6 shadow-[0_20px_45px_rgba(58,51,44,0.12)] border border-white/60 backdrop-blur-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[#F6E7D3]">
                  <stat.icon className="h-8 w-8" style={{ color: '#B88A58' }} />
                </div>
                <div className="text-3xl font-bold mb-2 text-[#3C2C22]">{stat.value}</div>
                <div className="text-[#6B5A4C]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose VastraVerse Section */}
      <section className="py-20 bg-gradient-to-br from-[#F8F1E6] via-[#E0D2C0] to-[#C3B099]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2F2118] mb-4">Why Choose VastraVerse?</h2>
            <p className="text-lg text-[#5A4B3F] max-w-2xl mx-auto">Experience the perfect blend of style, comfort, and quality in every piece we create.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white/95 rounded-2xl shadow-[0_25px_55px_rgba(60,48,31,0.12)] hover:shadow-[0_35px_65px_rgba(60,48,31,0.16)] transition-all duration-300 border border-[#E9DAC4] overflow-hidden backdrop-blur-sm">
              <div className="w-full h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&h=800&fit=crop&q=80" 
                  alt="Elevate Your Everyday" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Designed to Elevate Your Everyday</h3>
                <p className="text-gray-600">Our collections blend style and comfort, helping customers feel confident every day.</p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white/95 rounded-2xl shadow-[0_25px_55px_rgba(60,48,31,0.12)] hover:shadow-[0_35px_65px_rgba(60,48,31,0.16)] transition-all duration-300 border border-[#E9DAC4] overflow-hidden backdrop-blur-sm">
              <div className="w-full h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop&q=80" 
                  alt="Comfort That Moves With You" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Comfort That Moves With You</h3>
                <p className="text-gray-600">Premium, skin-friendly fabrics designed to keep users relaxed and active.</p>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white/95 rounded-2xl shadow-[0_25px_55px_rgba(60,48,31,0.12)] hover:shadow-[0_35px_65px_rgba(60,48,31,0.16)] transition-all duration-300 border border-[#E9DAC4] overflow-hidden backdrop-blur-sm">
              <div className="w-full h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=1200&h=800&fit=crop&q=80" 
                  alt="Timeless Style, Modern Touch" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Timeless Style, Modern Touch</h3>
                <p className="text-gray-600">A mix of classic silhouettes with contemporary details for a fresh, meaningful wardrobe.</p>
              </div>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-white/95 rounded-2xl shadow-[0_25px_55px_rgba(60,48,31,0.12)] hover:shadow-[0_35px_65px_rgba(60,48,31,0.16)] transition-all duration-300 border border-[#E9DAC4] overflow-hidden backdrop-blur-sm">
              <div className="w-full h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&h=800&fit=crop&q=80" 
                  alt="Crafted With Purpose" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Crafted With Purpose</h3>
                <p className="text-gray-600">Every piece is created with thoughtful craftsmanship and attention to detail.</p>
              </div>
            </div>

            {/* Feature Card 5 */}
            <div className="bg-white/95 rounded-2xl shadow-[0_25px_55px_rgba(60,48,31,0.12)] hover:shadow-[0_35px_65px_rgba(60,48,31,0.16)] transition-all duration-300 border border-[#E9DAC4] overflow-hidden backdrop-blur-sm">
              <div className="w-full h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1542060748-10c28b62716f?w=1200&h=800&fit=crop&q=80" 
                  alt="Your Style, Your Identity" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Style, Your Identity</h3>
                <p className="text-gray-600">Fashion that reflects the customer's personality — bold, minimal, or experimental.</p>
              </div>
            </div>

            {/* Feature Card 6 */}
            <div className="bg-white/95 rounded-2xl shadow-[0_25px_55px_rgba(60,48,31,0.12)] hover:shadow-[0_35px_65px_rgba(60,48,31,0.16)] transition-all duration-300 border border-[#E9DAC4] overflow-hidden backdrop-blur-sm">
              <div className="w-full h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&h=800&fit=crop&q=80" 
                  alt="Made for Real Life" 
                  className="w-full h-full object-cover"
                  loading="lazy"
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

import React, { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Product } from '../utils/api';

const pantsPalette = {
  background: 'linear-gradient(180deg, #f5f1ea 0%, #e4d5c3 45%, #cbb49d 100%)',
  panel: 'rgba(255, 255, 255, 0.88)'
};

type PantProduct = Product & {
  fit: 'Tailored' | 'Relaxed' | 'Athleisure' | 'Denim';
  fabric: 'Wool Blend' | 'Cotton Stretch' | 'Linen' | 'Tech Knit';
  tone: 'Ivory' | 'Cocoa' | 'Onyx' | 'Denim';
};

const mensPantsCollection: PantProduct[] = [
  {
    id: 901,
    name: 'Heritage Wool Trouser',
    description: 'Italian wool-blend tailored trouser with razor-sharp pleats and satin waistband.',
    price: 5499,
    category: 'Tailored',
    brand: 'Vastra Atelier',
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop',
    rating: 4.9,
    stock: 24,
    sizes: ['S', 'M', 'L', 'XL'],
    fit: 'Tailored',
    fabric: 'Wool Blend',
    tone: 'Ivory'
  },
  {
    id: 902,
    name: 'Midnight Satin Stripe Pant',
    description: 'Tuxedo-inspired satin stripe pant with concealed fastening and refined taper.',
    price: 4999,
    category: 'Tailored',
    brand: 'Noir Club',
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&h=800&fit=crop',
    rating: 4.7,
    stock: 16,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fit: 'Tailored',
    fabric: 'Wool Blend',
    tone: 'Onyx'
  },
  {
    id: 903,
    name: 'Muse Linen Relaxed Pant',
    description: 'Breathable linen trousers with drawcord waist, travel crease guard, and relaxed drape.',
    price: 3899,
    category: 'Resort',
    brand: 'Azure Line',
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=600&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=600&h=800&fit=crop',
    rating: 4.6,
    stock: 30,
    sizes: ['S', 'M', 'L', 'XL'],
    fit: 'Relaxed',
    fabric: 'Linen',
    tone: 'Ivory'
  },
  {
    id: 904,
    name: 'Arbor Stretch Chino',
    description: 'Performance cotton-stretch chino with articulated knees and anti-crease finish.',
    price: 3299,
    category: 'Smart Casual',
    brand: 'Heritage Oaks',
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?w=600&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1514996937319-344454492b37?w=600&h=800&fit=crop',
    rating: 4.5,
    stock: 28,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fit: 'Relaxed',
    fabric: 'Cotton Stretch',
    tone: 'Cocoa'
  },
  {
    id: 905,
    name: 'Cityline Tech Jogger',
    description: 'Athleisure jogger with bonded seams, water-repellent finish, and invisible zipper pockets.',
    price: 2999,
    category: 'Athleisure',
    brand: 'Velocity',
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1502740438517-30d4b08e61a0?w=600&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1502740438517-30d4b08e61a0?w=600&h=800&fit=crop',
    rating: 4.4,
    stock: 34,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fit: 'Athleisure',
    fabric: 'Tech Knit',
    tone: 'Onyx'
  },
  {
    id: 906,
    name: 'Sculpt Denim Trouser',
    description: 'Japanese selvedge denim with enzyme wash, structured waistband, and ankle crop.',
    price: 3599,
    category: 'Denim',
    brand: 'Indigo Borough',
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=800&fit=crop',
    rating: 4.5,
    stock: 22,
    sizes: ['S', 'M', 'L', 'XL'],
    fit: 'Denim',
    fabric: 'Cotton Stretch',
    tone: 'Denim'
  },
  {
    id: 907,
    name: 'Valet Pleated Pant',
    description: 'Double-pleated pant with hand-finished cuffs and champagne piping inside the waist.',
    price: 4199,
    category: 'Tailored',
    brand: 'Maison Guild',
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=600&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=600&h=800&fit=crop',
    rating: 4.8,
    stock: 18,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fit: 'Tailored',
    fabric: 'Wool Blend',
    tone: 'Cocoa'
  },
  {
    id: 908,
    name: 'Serene Linen Drawstring',
    description: 'Ultra-light linen drawstring pant with tonal beadwork and fluid drape.',
    price: 3199,
    category: 'Resort',
    brand: 'Isla Atelier',
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=800&fit=crop',
    rating: 4.3,
    stock: 26,
    sizes: ['S', 'M', 'L', 'XL'],
    fit: 'Relaxed',
    fabric: 'Linen',
    tone: 'Ivory'
  },
  {
    id: 909,
    name: 'Carbon Grid Cargo',
    description: 'Technical cargo pant with laser-cut vents and magnetic pocket closures.',
    price: 3399,
    category: 'Athleisure',
    brand: 'Form Labs',
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=800&fit=crop',
    rating: 4.5,
    stock: 32,
    sizes: ['S', 'M', 'L', 'XL'],
    fit: 'Athleisure',
    fabric: 'Tech Knit',
    tone: 'Onyx'
  },
  {
    id: 910,
    name: 'Velour Lounge Pant',
    description: 'Cloud-soft velour pant with satin trims, perfect for premium leisure looks.',
    price: 2899,
    category: 'Lounge',
    brand: 'Casa Deluxe',
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1514311548104-ae305aac4688?w=600&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1514311548104-ae305aac4688?w=600&h=800&fit=crop',
    rating: 4.2,
    stock: 20,
    sizes: ['S', 'M', 'L', 'XL'],
    fit: 'Relaxed',
    fabric: 'Tech Knit',
    tone: 'Cocoa'
  },
  {
    id: 911,
    name: 'Featherweight Commute Pant',
    description: 'Wrinkle-resistant polished pant with comfort stretch and reflective hem tabs.',
    price: 3099,
    category: 'Smart Casual',
    brand: 'Metroline',
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=600&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=600&h=800&fit=crop',
    rating: 4.4,
    stock: 27,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fit: 'Relaxed',
    fabric: 'Cotton Stretch',
    tone: 'Denim'
  },
  {
    id: 912,
    name: 'Summit Trail Pant',
    description: 'Elevated hiking pant with four-way stretch, storm guard cuffs, and luxe hardware.',
    price: 3799,
    category: 'Performance',
    brand: 'Alt Terra',
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=800&fit=crop',
    rating: 4.6,
    stock: 25,
    sizes: ['S', 'M', 'L', 'XL'],
    fit: 'Athleisure',
    fabric: 'Tech Knit',
    tone: 'Denim'
  }
];

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const fitOptions: PantProduct['fit'][] = ['Tailored', 'Relaxed', 'Athleisure', 'Denim'];
const fabricOptions: PantProduct['fabric'][] = ['Wool Blend', 'Cotton Stretch', 'Linen', 'Tech Knit'];
const toneOptions: PantProduct['tone'][] = ['Ivory', 'Cocoa', 'Onyx', 'Denim'];

const MensPantsPage: React.FC = () => {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedFits, setSelectedFits] = useState<PantProduct['fit'][]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<PantProduct['fabric'][]>([]);
  const [selectedTones, setSelectedTones] = useState<PantProduct['tone'][]>([]);
  const [priceRange, setPriceRange] = useState({ min: 2500, max: 6000 });
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'popular'>('newest');

  const toggleSelection = <T,>(value: T, setter: React.Dispatch<React.SetStateAction<T[]>>) => {
    setter(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...mensPantsCollection];

    if (selectedSizes.length) {
      filtered = filtered.filter(product => product.sizes?.some(size => selectedSizes.includes(size)));
    }

    if (selectedFits.length) {
      filtered = filtered.filter(product => selectedFits.includes(product.fit));
    }

    if (selectedFabrics.length) {
      filtered = filtered.filter(product => selectedFabrics.includes(product.fabric));
    }

    if (selectedTones.length) {
      filtered = filtered.filter(product => selectedTones.includes(product.tone));
    }

    filtered = filtered.filter(product => {
      const price = Number(product.price) || 0;
      return price >= priceRange.min && price <= priceRange.max;
    });

    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => Number(a.price) - Number(b.price));
      case 'price-high':
        return filtered.sort((a, b) => Number(b.price) - Number(a.price));
      case 'popular':
        return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest':
      default:
        return filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
    }
  }, [selectedSizes, selectedFits, selectedFabrics, selectedTones, priceRange, sortBy]);

  const resetFilters = () => {
    setSelectedSizes([]);
    setSelectedFits([]);
    setSelectedFabrics([]);
    setSelectedTones([]);
    setPriceRange({ min: 2500, max: 6000 });
  };

  return (
    <div className="min-h-screen" style={{ background: pantsPalette.background }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 space-y-12">
        <header className="text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-royalBrown/70">Menswear Atelier</p>
          <h1 className="text-5xl font-heading text-royalBrown">Curated Pant Edit</h1>
          <p className="text-lg text-royalBrown/80 max-w-3xl mx-auto">
            Tailored trousers, relaxed resort fits, and advanced athleisure silhouettes designed for the modern gentleman.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            {[
              { label: 'Fabric Stories', value: '4 signature blends' },
              { label: 'Hand-Finished Details', value: '18 stitches per inch' },
              { label: 'Fit Range', value: 'XS - XXL' },
              { label: 'Ready to Ship', value: '24H dispatch' }
            ].map(item => (
              <div key={item.label} className="rounded-2xl border border-white/30 bg-white/60 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-royalBrown/60">{item.label}</p>
                <p className="text-lg font-semibold text-royalBrown">{item.value}</p>
              </div>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10">
          <aside className="rounded-3xl" style={{ background: pantsPalette.panel, border: '1px solid rgba(196,158,84,0.35)' }}>
            <div className="p-6 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-heading text-royalBrown">Filter Collection</h2>
                <button
                  onClick={resetFilters}
                  className="text-sm font-medium text-royalBrown/70 hover:text-royalBrown transition-colors"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold text-royalBrown">Sizes</p>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map(size => (
                    <button
                      key={size}
                      onClick={() => toggleSelection(size, setSelectedSizes)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        selectedSizes.includes(size)
                          ? 'bg-royalBrown text-white border-royalBrown'
                          : 'bg-white text-royalBrown border-royalBrown/30'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold text-royalBrown">Fits</p>
                <div className="flex flex-wrap gap-2">
                  {fitOptions.map(fit => (
                    <button
                      key={fit}
                      onClick={() => toggleSelection(fit, setSelectedFits)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        selectedFits.includes(fit)
                          ? 'bg-royalBrown text-white border-royalBrown'
                          : 'bg-white text-royalBrown border-royalBrown/30'
                      }`}
                    >
                      {fit}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold text-royalBrown">Fabric Stories</p>
                <div className="grid grid-cols-2 gap-3">
                  {fabricOptions.map(fabric => (
                    <label key={fabric} className="flex items-center space-x-2 text-sm text-royalBrown">
                      <input
                        type="checkbox"
                        checked={selectedFabrics.includes(fabric)}
                        onChange={() => toggleSelection(fabric, setSelectedFabrics)}
                        className="accent-royalBrown"
                      />
                      <span>{fabric}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold text-royalBrown">Color Mood</p>
                <div className="flex flex-wrap gap-3">
                  {toneOptions.map(tone => (
                    <button
                      key={tone}
                      onClick={() => toggleSelection(tone, setSelectedTones)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        selectedTones.includes(tone)
                          ? 'bg-royalBrown text-white border-royalBrown'
                          : 'bg-white text-royalBrown border-royalBrown/30'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-royalBrown">Price Range (₹)</p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl border border-royalBrown/30 bg-white text-royalBrown"
                  />
                  <span className="text-royalBrown">-</span>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl border border-royalBrown/30 bg-white text-royalBrown"
                  />
                </div>
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <p className="text-sm uppercase tracking-[0.25em] text-royalBrown/70">
                {filteredProducts.length} curated pants
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2 rounded-full border border-royalBrown/30 bg-white text-royalBrown"
              >
                <option value="newest">Sort: Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Loved</option>
              </select>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-royalBrown/30 bg-white/70 p-10 text-center">
                <p className="text-lg font-heading text-royalBrown mb-2">No silhouettes match that curation.</p>
                <p className="text-royalBrown/70">Try resetting filters or exploring another fit story.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default MensPantsPage;

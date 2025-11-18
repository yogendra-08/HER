/**
 * Navigation Bar Component for VastraVerse
 * Main navigation with authentication and cart/wishlist indicators
 */

import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Heart, 
  User as UserIcon,
  Menu, 
  X, 
  LogOut,
  Search,
  ChevronDown,
  Package,
  Phone
} from 'lucide-react';

import { removeAuthToken } from '../utils/api';
import type { User as UserType } from '../utils/api';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import toast from 'react-hot-toast';

interface NavbarProps {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
}

type NavLink =
  | {
      path: string;
      label: string;
    }
  | {
      label: string;
      dropdown: { path: string; label: string }[];
    };

const Navbar: React.FC<NavbarProps> = ({ user, setUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();

  const handleLogout = () => {
    removeAuthToken();
    setUser(null);
    setIsProfileMenuOpen(false);
    toast.success('Logged out successfully!');
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const isActiveLink = (path: string) => location.pathname === path;

  const navLinks: NavLink[] = [
    { path: '/', label: 'Home' },
    { 
      label: 'Genz',
      dropdown: [
        { path: '/genz', label: 'Genz Collection' },
        { path: '/products/men', label: 'Men\'s Genz' },
        { path: '/products/women', label: 'Women\'s Genz' },
      ]
    },
    { 
      label: 'Men',
      dropdown: [
        { path: '/products/men', label: 'Men\'s Collection' },
        { path: '/products/men?category=shirts', label: 'Shirts' },
        { path: '/products/men/pants', label: 'Pants' },
        { path: '/products/men?category=traditional', label: 'Traditional' },
      ]
    },
    { 
      label: 'Women',
      dropdown: [
        { path: '/products/women', label: 'Women\'s Collection' },
        { path: '/products/women?category=sarees', label: 'Sarees' },
        { path: '/products/women?category=kurtis', label: 'Kurtis' },
        { path: '/products/women?category=dresses', label: 'Dresses' },
      ]
    },
    { 
      label: 'Kids',
      dropdown: [
        { path: '/products/kids', label: 'Kids\' Collection' },
        { path: '/products/kids?category=boys', label: 'Boys' },
        { path: '/products/kids?category=girls', label: 'Girls' },
        { path: '/products/kids?category=traditional', label: 'Traditional' },
      ]
    },
    { 
      label: 'Traditional',
      dropdown: [
        { path: '/products/traditional', label: 'Traditional Collection' },
        { path: '/products/traditional?category=sarees', label: 'Sarees' },
        { path: '/products/traditional?category=sherwanis', label: 'Sherwanis' },
        { path: '/products/traditional?category=lehengas', label: 'Lehengas' },
      ]
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[rgba(251,251,250,0.01)] shadow-luxury border-b border-[rgba(196,193,184,0.6)] backdrop-blur-xl'
          : 'bg-light-bg shadow-luxury-sm border-b border-soft-beige'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-4 mr-8">
              <img 
                src="/logo.png" 
                alt="VastraVerse Logo" 
                className="w-10 h-10 object-contain"
              />
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold gradient-text">VastraVerse</h1>
                <p className="text-xs text-neutral-grey -mt-1">Your Fashion, Your Way</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              'dropdown' in link ? (
                <div
                  key={link.label}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className={`nav-link ${activeDropdown === link.label ? 'active' : ''}`}>
                    {link.label}
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 mt-3 w-56 bg-light-bg rounded-luxury-lg shadow-[0_18px_45px_rgba(196,193,184,0.45)] border border-[rgba(196,193,184,0.6)] py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out transform origin-top group-hover:translate-y-0 translate-y-2 z-50">
                    {link.dropdown.map((item, index) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => {
                          setActiveDropdown(null);
                          setIsMenuOpen(false);
                        }}
                        className={`block px-4 py-2.5 text-sm text-darkest-accent hover:text-warm-grey hover:bg-[rgba(199,189,170,0.18)] transition-all duration-200 ${
                          index === 0 ? 'border-t border-warm-taupe' : ''
                        } ${
                          index === link.dropdown.length - 1 ? 'border-b border-warm-taupe' : ''
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${isActiveLink(link.path) ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-soft-beige rounded-luxury focus:ring-2 focus:ring-warm-taupe focus:border-warm-taupe bg-light-bg text-deep-brown placeholder-neutral-grey"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-grey" strokeWidth={1.5} />
            </form>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-3">

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2 text-deep-brown hover:text-warm-grey transition-colors relative group"
            >
              <Heart className="h-5 w-5" strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-warm-taupe text-light-bg text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium text-[10px]">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 text-deep-brown hover:text-warm-grey transition-colors relative group"
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-warm-taupe text-light-bg text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium text-[10px]">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-1 p-2 text-deep-brown hover:text-warm-grey"
              >
                <UserIcon className="h-5 w-5" strokeWidth={1.5} />
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isProfileMenuOpen ? 'rotate-180' : ''
                  }`}
                  strokeWidth={1.5}
                />
              </button>

              {/* Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-light-bg rounded-luxury-lg shadow-[0_18px_45px_rgba(196,193,184,0.35)] border border-[rgba(196,193,184,0.6)] py-2 z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-[rgba(196,193,184,0.6)]">
                        <p className="text-sm font-semibold text-deep-brown">{user.name}</p>
                        <p className="text-xs text-neutral-grey mt-1">{user.email}</p>
                      </div>

                      <Link
                        to="/orders"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-darkest-accent hover:text-warm-grey hover:bg-[rgba(199,189,170,0.15)] transition-colors"
                      >
                        <Package className="h-4 w-4" />
                        <span>Orders</span>
                      </Link>

                      <Link
                        to="/contact"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-darkest-accent hover:text-warm-grey hover:bg-[rgba(199,189,170,0.15)] transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        <span>Contact Us</span>
                      </Link>

                      <div className="border-t border-[rgba(196,193,184,0.6)] my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center space-x-3 px-4 py-2.5 text-sm text-darkest-accent hover:text-warm-grey hover:bg-[rgba(199,189,170,0.15)] transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-darkest-accent hover:text-warm-grey hover:bg-[rgba(199,189,170,0.15)] transition-colors"
                      >
                        <UserIcon className="h-4 w-4" />
                        <span>Login</span>
                      </Link>

                      <Link
                        to="/signup"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-darkest-accent hover:text-warm-grey hover:bg-[rgba(199,189,170,0.15)] transition-colors"
                      >
                        <UserIcon className="h-4 w-4" />
                        <span>Sign Up</span>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-deep-brown hover:text-warm-grey"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-soft-beige py-4">
            <div className="mb-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-soft-beige rounded-luxury bg-light-bg text-deep-brown"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-grey" />
              </form>
            </div>

            <div className="space-y-2">
              {navLinks.map((link) => (
                'dropdown' in link ? (
                  <div key={link.label} className="space-y-1">
                    <div className="px-4 py-2 text-deep-brown font-medium tracking-elegant">
                      {link.label}
                    </div>
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-8 py-2 text-sm text-deep-brown hover:text-warm-grey hover:bg-soft-beige transition-colors duration-200"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-deep-brown hover:text-warm-grey hover:bg-soft-beige"
                  >
                    {link.label}
                  </Link>
                )
              ))}

              {!user && (
                <>
                  <div className="border-t border-soft-beige my-2"></div>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-deep-brown"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-center font-medium bg-warm-taupe text-light-bg rounded-luxury"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

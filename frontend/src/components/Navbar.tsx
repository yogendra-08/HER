/**
 * Navigation Bar Component for VastraVerse
 * Main navigation with authentication and cart/wishlist indicators
 */

import React, { useState } from 'react';
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

const Navbar: React.FC<NavbarProps> = ({ user, setUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/genz', label: 'Genz' },
    { path: '/products/men', label: 'Men' },
    { path: '/products/women', label: 'Women' },
    { path: '/products/kids', label: 'Kids' },
    { path: '/products/traditional', label: 'Traditional' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
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
                <p className="text-xs text-gray-500 -mt-1">Your Fashion, Your Way</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActiveLink(link.path) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
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
                className="w-full pl-10 pr-4 py-2 border border-gold/30 rounded-luxury focus:ring-2 focus:ring-gold focus:border-gold bg-cream text-royalBrown"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4" strokeWidth={1.5} />
            </form>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-3">

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2 text-chocolate hover:text-royalBrown transition-colors relative group"
            >
              <Heart className="h-5 w-5" strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-royalBrown text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium text-[10px]">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 text-chocolate hover:text-royalBrown transition-colors relative group"
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-royalBrown text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium text-[10px]">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-1 p-2 text-chocolate hover:text-royalBrown"
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
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-luxury-lg shadow-luxury border border-gold/20 py-2 z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-gold/20">
                        <p className="text-sm font-semibold text-royalBrown">{user.name}</p>
                        <p className="text-xs text-chocolate mt-1">{user.email}</p>
                      </div>

                      <Link
                        to="/orders"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-chocolate hover:bg-sandBeige"
                      >
                        <Package className="h-4 w-4" />
                        <span>Orders</span>
                      </Link>

                      <Link
                        to="/contact"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-chocolate hover:bg-sandBeige"
                      >
                        <Phone className="h-4 w-4" />
                        <span>Contact Us</span>
                      </Link>

                      <div className="border-t border-gold/20 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center space-x-3 px-4 py-2.5 text-sm text-chocolate hover:bg-sandBeige"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-chocolate hover:bg-sandBeige"
                      >
                        <UserIcon className="h-4 w-4" />
                        <span>Login</span>
                      </Link>

                      <Link
                        to="/signup"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-chocolate hover:bg-sandBeige"
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
              className="lg:hidden p-2 text-chocolate hover:text-royalBrown"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="mb-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gold/30 rounded-luxury"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4" />
              </form>
            </div>

            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-chocolate hover:text-royalBrown hover:bg-sandBeige"
                >
                  {link.label}
                </Link>
              ))}

              {!user && (
                <>
                  <div className="border-t border-gold/20 my-2"></div>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-center font-medium bg-gold text-royalBrown rounded-luxury"
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

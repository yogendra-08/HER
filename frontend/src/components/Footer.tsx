/**
 * Footer Component for VastraVerse
 * Site footer with links, contact info, and social media
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-white" style={{ background: '#2C1810' }}>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-light rounded-luxury flex items-center justify-center shadow-gold">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold font-heading" style={{ color: '#C49E54' }}>VastraVerse</h3>
                <p className="text-sm" style={{ color: '#E9E4D4' }}>Your Fashion, Your Way</p>
              </div>
            </div>
            <p className="mb-6" style={{ color: '#E9E4D4' }}>
              Explore the Universe of Indian Fashion with our curated collection of traditional and modern clothing.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="transition-colors" style={{ color: '#E9E4D4' }} onMouseEnter={(e) => e.currentTarget.style.color = '#C49E54'} onMouseLeave={(e) => e.currentTarget.style.color = '#E9E4D4'}>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="transition-colors" style={{ color: '#E9E4D4' }} onMouseEnter={(e) => e.currentTarget.style.color = '#C49E54'} onMouseLeave={(e) => e.currentTarget.style.color = '#E9E4D4'}>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="transition-colors" style={{ color: '#E9E4D4' }} onMouseEnter={(e) => e.currentTarget.style.color = '#C49E54'} onMouseLeave={(e) => e.currentTarget.style.color = '#E9E4D4'}>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="transition-colors" style={{ color: '#E9E4D4' }} onMouseEnter={(e) => e.currentTarget.style.color = '#C49E54'} onMouseLeave={(e) => e.currentTarget.style.color = '#E9E4D4'}>
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold font-heading mb-4" style={{ color: '#C49E54' }}>Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="transition-colors" style={{ color: '#E9E4D4' }} onMouseEnter={(e) => e.currentTarget.style.color = '#C49E54'} onMouseLeave={(e) => e.currentTarget.style.color = '#E9E4D4'}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-blue-200 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products/men" className="text-blue-200 hover:text-white transition-colors">
                  Men's Fashion
                </Link>
              </li>
              <li>
                <Link to="/products/women" className="text-blue-200 hover:text-white transition-colors">
                  Women's Fashion
                </Link>
              </li>
              <li>
                <Link to="/products/kids" className="text-blue-200 hover:text-white transition-colors">
                  Kids' Fashion
                </Link>
              </li>
              <li>
                <Link to="/products/traditional" className="text-blue-200 hover:text-white transition-colors">
                  Traditional Wear
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold font-heading mb-4" style={{ color: '#C49E54' }}>Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="transition-colors" style={{ color: '#E9E4D4' }} onMouseEnter={(e) => e.currentTarget.style.color = '#C49E54'} onMouseLeave={(e) => e.currentTarget.style.color = '#E9E4D4'}>
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="transition-colors" style={{ color: '#E9E4D4' }} onMouseEnter={(e) => e.currentTarget.style.color = '#C49E54'} onMouseLeave={(e) => e.currentTarget.style.color = '#E9E4D4'}>
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors" style={{ color: '#E9E4D4' }} onMouseEnter={(e) => e.currentTarget.style.color = '#C49E54'} onMouseLeave={(e) => e.currentTarget.style.color = '#E9E4D4'}>
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors" style={{ color: '#E9E4D4' }} onMouseEnter={(e) => e.currentTarget.style.color = '#C49E54'} onMouseLeave={(e) => e.currentTarget.style.color = '#E9E4D4'}>
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors" style={{ color: '#E9E4D4' }} onMouseEnter={(e) => e.currentTarget.style.color = '#C49E54'} onMouseLeave={(e) => e.currentTarget.style.color = '#E9E4D4'}>
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors" style={{ color: '#E9E4D4' }} onMouseEnter={(e) => e.currentTarget.style.color = '#C49E54'} onMouseLeave={(e) => e.currentTarget.style.color = '#E9E4D4'}>
                  Track Your Order
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold font-heading mb-4" style={{ color: '#C49E54' }}>Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                <div style={{ color: '#E9E4D4' }}>
                  <p>123 Fashion Street</p>
                  <p>Mumbai, Maharashtra 400001</p>
                  <p>India</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gold flex-shrink-0" />
                <span style={{ color: '#E9E4D4' }}>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gold flex-shrink-0" />
                <span style={{ color: '#E9E4D4' }}>support@vastraverse.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section with Luxury Divider */}
        <div className="mt-12 pt-8" style={{ position: 'relative' }}>
          <div className="absolute top-0 left-0 right-0" style={{ 
            background: 'repeating-linear-gradient(90deg, #C49E54 0px, #C49E54 10px, transparent 10px, transparent 20px)',
            height: '2px'
          }}></div>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm" style={{ color: '#E9E4D4' }}>
              © {currentYear} VastraVerse. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm transition-colors" style={{ color: '#E9E4D4' }} onMouseEnter={(e) => e.currentTarget.style.color = '#C49E54'} onMouseLeave={(e) => e.currentTarget.style.color = '#E9E4D4'}>
                Privacy Policy
              </a>
              <a href="#" className="text-sm transition-colors" style={{ color: '#E9E4D4' }} onMouseEnter={(e) => e.currentTarget.style.color = '#C49E54'} onMouseLeave={(e) => e.currentTarget.style.color = '#E9E4D4'}>
                Terms of Service
              </a>
              <a href="#" className="text-sm transition-colors" style={{ color: '#E9E4D4' }} onMouseEnter={(e) => e.currentTarget.style.color = '#C49E54'} onMouseLeave={(e) => e.currentTarget.style.color = '#E9E4D4'}>
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

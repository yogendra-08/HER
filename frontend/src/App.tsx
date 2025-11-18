/**
 * Simplified App Component for VastraVerse
 * Works without backend - uses local data
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import GenZPage from './pages/GenZPage';
import MensCollectionPage from './pages/MensCollectionPage';
import WomensCollectionPage from './pages/WomensCollectionPage';
import KidsCollectionPage from './pages/KidsCollectionPage';
import TraditionalCollectionPage from './pages/TraditionalCollectionPage';
import SummerCollectionPage from './pages/SummerCollectionPage';
import CollectionPage from './pages/CollectionPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import ContactPage from './pages/ContactPage';
import { type User, getAuthToken } from './utils/api';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in on mount from localStorage
    const token = getAuthToken();
    const userJson = localStorage.getItem('vastraverse_user');
    if (token && userJson) {
      try {
        const currentUser = JSON.parse(userJson);
        setUser(currentUser);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('vastraverse_user');
        localStorage.removeItem('vastraverse_token');
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-royalBrown">
      <Navbar user={user} setUser={setUser} />
      
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/genz" element={<GenZPage />} />
          <Route path="/summer-collection" element={<SummerCollectionPage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/products/men" element={<MensCollectionPage />} />
          <Route path="/products/women" element={<WomensCollectionPage />} />
          <Route path="/products/kids" element={<KidsCollectionPage />} />
          <Route path="/products/traditional" element={<TraditionalCollectionPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:category" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/signup" element={<SignupPage setUser={setUser} />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Catch all route */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                  <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
                  <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
                  <a 
                    href="/" 
                    className="btn-primary inline-block"
                  >
                    Go Home
                  </a>
                </div>
              </div>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;

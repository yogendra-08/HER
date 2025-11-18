/**
 * Cart Page Component for VastraVerse
 * Display cart items and checkout with modern attractive design
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import toast from 'react-hot-toast';

const CartPage: React.FC = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, isLoading } = useCart();

  const formatPrice = (price: number | undefined | null) => {
    const validPrice = Number(price) || 0;
    if (isNaN(validPrice) || validPrice <= 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(validPrice);
  };

  const handleRemove = (productId: number, productName: string) => {
    removeFromCart(productId);
    toast.success(`${productName} removed from cart`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-sandBeige to-cream">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold border-t-transparent mx-auto mb-4"></div>
          <p className="text-chocolate font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-sandBeige to-cream py-16">
        <div className="text-center max-w-md mx-auto px-4 animate-fade-in">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gold/20 rounded-full blur-3xl"></div>
            <ShoppingBag className="h-32 w-32 text-gold mx-auto relative z-10 animate-bounce-gentle" />
          </div>
          <h2 className="text-4xl font-heading font-bold text-royalBrown mb-4">Your cart is empty</h2>
          <p className="text-chocolate text-lg mb-8">Discover our premium collection and add items to your cart!</p>
          <Link 
            to="/products" 
            className="btn-primary inline-flex items-center space-x-2 group"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-cream via-sandBeige/50 to-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center space-x-3 mb-2">
            <ShoppingCart className="h-8 w-8 text-gold" />
            <h1 className="text-4xl font-heading font-bold text-royalBrown">Shopping Cart</h1>
          </div>
          <p className="text-chocolate text-lg">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className="bg-white rounded-luxury-lg shadow-luxury p-6 border border-gold/20 hover:shadow-gold-lg transition-all duration-300 transform hover:scale-[1.01] animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Product Image */}
                  <div className="relative group flex-shrink-0">
                    <div className="absolute inset-0 bg-gold/20 rounded-luxury blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-luxury shadow-md relative z-10 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-heading font-semibold text-royalBrown mb-2 group-hover:text-gold transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-2xl font-bold text-gold mb-3">{formatPrice(Number(item.price) || 0)}</p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-chocolate font-medium">Quantity:</span>
                      <div className="flex items-center space-x-2 bg-sandBeige rounded-luxury p-1">
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateQuantity(item.productId, item.quantity - 1);
                            } else {
                              handleRemove(item.productId, item.name);
                            }
                          }}
                          className="p-2 rounded-lg hover:bg-white transition-colors text-royalBrown hover:text-gold"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-semibold text-royalBrown">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-2 rounded-lg hover:bg-white transition-colors text-royalBrown hover:text-gold"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Item Total */}
                    <div className="mt-3 pt-3 border-t border-gold/20">
                      <div className="flex justify-between items-center">
                        <span className="text-chocolate">Item Total:</span>
                        <span className="text-xl font-bold text-royalBrown">{formatPrice((Number(item.price) || 0) * (Number(item.quantity) || 0))}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.productId, item.name)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-luxury transition-all duration-300 hover:scale-110 flex-shrink-0"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary - Sticky */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-gradient-to-br from-white to-sandBeige/30 rounded-luxury-lg shadow-luxury p-6 border-2 border-gold/30">
              <div className="flex items-center space-x-2 mb-6">
                <div className="h-1 w-12 bg-gradient-to-r from-gold to-royalBrown rounded-full"></div>
                <h2 className="text-2xl font-heading font-bold text-royalBrown">Order Summary</h2>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gold/20">
                  <span className="text-chocolate font-medium">Items ({totalItems})</span>
                  <span className="font-semibold text-royalBrown">{formatPrice(Number(totalPrice) || 0)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gold/20">
                  <span className="text-chocolate font-medium">Shipping</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="pt-4 border-t-2 border-gold/30">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-heading font-bold text-royalBrown">Total</span>
                    <span className="text-3xl font-bold text-gold">{formatPrice(Number(totalPrice) || 0)}</span>
                  </div>
                </div>
              </div>
              
              <Link 
                to="/checkout" 
                className="w-full btn-primary block text-center group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-chocolate to-royalBrown opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              
              <p className="text-xs text-chocolate/70 text-center mt-4">
                Secure checkout • Free shipping • Easy returns
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

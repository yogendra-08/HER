/**
 * Enhanced Checkout Page Component for VastraVerse
 * Order confirmation, customer details, and order tracking
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Truck, Package, CheckCircle2, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { orderAPI, type OrderItem } from '../utils/api';
import toast from 'react-hot-toast';
import Receipt from '../components/Receipt';

type OrderStatus = 'PLACED' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';

interface OrderStatusStep {
  id: OrderStatus;
  title: string;
  description: string;
  icon: React.ReactNode;
  active: boolean;
  completed: boolean;
}

const getCurrentDate = () => {
  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  
  return {
    orderDate: today.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    deliveryDate: deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  };
};

const CheckoutPage: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(`ORD${Math.floor(100000 + Math.random() * 900000)}`);
  const [customerName, setCustomerName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('PLACED');
  const { orderDate, deliveryDate } = getCurrentDate();
  const navigate = useNavigate();

  // Load user data from localStorage if available
  useEffect(() => {
    const userJson = localStorage.getItem('vastraverse_user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        if (user.name) setCustomerName(user.name);
        if (user.phone) setPhoneNumber(user.phone);
        if (user.address) setDeliveryAddress(user.address);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  }, []);

  const orderStatusSteps: OrderStatusStep[] = [
    {
      id: 'PLACED',
      title: 'Order Placed',
      description: 'We have received your order',
      icon: <CheckCircle2 className="h-5 w-5" />,
      active: currentStatus === 'PLACED',
      completed: ['PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(currentStatus)
    },
    {
      id: 'PACKED',
      title: 'Packed',
      description: 'Your order is being prepared',
      icon: <Package className="h-5 w-5" />,
      active: currentStatus === 'PACKED',
      completed: ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(currentStatus)
    },
    {
      id: 'SHIPPED',
      title: 'Shipped',
      description: 'Your order is on the way',
      icon: <Truck className="h-5 w-5" />,
      active: currentStatus === 'SHIPPED',
      completed: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(currentStatus)
    },
    {
      id: 'OUT_FOR_DELIVERY',
      title: 'Out for Delivery',
      description: 'Delivery partner is on the way',
      icon: <Truck className="h-5 w-5" />,
      active: currentStatus === 'OUT_FOR_DELIVERY',
      completed: currentStatus === 'DELIVERED'
    },
    {
      id: 'DELIVERED',
      title: 'Delivered',
      description: 'Your order has been delivered',
      icon: <CheckCircle2 className="h-5 w-5" />,
      active: currentStatus === 'DELIVERED',
      completed: false
    }
  ];

  // Simulate order status updates
  useEffect(() => {
    if (orderPlaced) {
      const statuses: OrderStatus[] = ['PLACED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
      let currentIndex = 0;
      
      const interval = setInterval(() => {
        if (currentIndex < statuses.length - 1) {
          currentIndex++;
          setCurrentStatus(statuses[currentIndex]);
        } else {
          clearInterval(interval);
        }
      }, 10000); // Update status every 10 seconds for demo
      
      return () => clearInterval(interval);
    }
  }, [orderPlaced]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty. Add items to cart first!');
      navigate('/products');
      return;
    }

    if (!customerName || !customerName.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!phoneNumber || !phoneNumber.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    // Basic phone validation
    const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    if (!deliveryAddress || !deliveryAddress.trim()) {
      toast.error('Please enter your delivery address');
      return;
    }

    if (deliveryAddress.trim().length < 10) {
      toast.error('Please enter a complete delivery address');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Get user email from localStorage if available
      const userJson = localStorage.getItem('vastraverse_user');
      const userEmail = userJson ? JSON.parse(userJson).email : `${customerName.toLowerCase().replace(/\s+/g, '.')}@example.com`;

      // Convert cart items to order items
      const orderItems: OrderItem[] = items.map(item => ({
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        product_image: item.image || '',
        quantity: item.quantity || 1,
        collection: 'men' as 'men' | 'women', // You can determine this based on product data
      }));

      // Create order in database
      const response = await orderAPI.create({
        user_name: customerName,
        user_email: userEmail,
        user_phone: phoneNumber,
        location: deliveryAddress,
        products: orderItems,
      });

      if (response.success && response.data) {
        const savedOrder = response.data.order;
        // Update order ID with the one from database
        setOrderId(savedOrder.id || orderId);
        setIsProcessing(false);
        setOrderPlaced(true);
        clearCart();
        toast.success('Order placed successfully and saved to database!');
        console.log('Order saved:', savedOrder);
      } else {
        throw new Error(response.message || 'Failed to create order');
      }
    } catch (error: any) {
      console.error('Error placing order:', error);
      setIsProcessing(false);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to place order. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen py-8 bg-gradient-to-br from-cream via-sandBeige/50 to-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-white to-sandBeige/20 rounded-luxury-lg shadow-luxury p-8 mb-6 border-2 border-gold/30 animate-slide-up">
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto relative z-10 animate-bounce-gentle" />
              </div>
              <h1 className="text-4xl font-heading font-bold text-royalBrown mb-3 bg-gradient-to-r from-royalBrown to-chocolate bg-clip-text text-transparent">
                Order Placed Successfully!
              </h1>
              <p className="text-chocolate text-lg mb-2">Thank you for shopping with VastraVerse.</p>
              <div className="inline-flex items-center space-x-2 bg-gold/10 px-4 py-2 rounded-luxury mt-3">
                <span className="text-sm text-chocolate font-medium">Order ID:</span>
                <span className="text-sm font-heading font-bold text-royalBrown">{orderId}</span>
              </div>
            </div>

            {/* Order Status Timeline */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-6">
                <div className="h-1 w-12 bg-gradient-to-r from-gold to-royalBrown rounded-full"></div>
                <h2 className="text-2xl font-heading font-bold text-royalBrown">Order Status</h2>
              </div>
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-gold/30 via-gold/50 to-gold/30 rounded-full"></div>
                {orderStatusSteps.map((step, index) => (
                  <div key={step.id} className="relative flex items-start mb-8 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 ${
                      step.completed 
                        ? 'bg-gradient-to-br from-green-500 to-green-600 scale-110' 
                        : step.active 
                        ? 'bg-gradient-to-br from-gold to-royalBrown scale-110 animate-pulse' 
                        : 'bg-sandBeige border-2 border-gold/30'
                    }`}>
                      {step.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      ) : step.active ? (
                        <Clock className="h-6 w-6 text-white" />
                      ) : (
                        <div className="w-3 h-3 bg-gold/50 rounded-full"></div>
                      )}
                    </div>
                    <div className="ml-6 flex-1">
                      <h3 className="font-heading font-semibold text-lg text-royalBrown mb-1">{step.title}</h3>
                      <p className="text-chocolate">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details */}
            <div className="border-t-2 border-gold/30 pt-8">
              <div className="flex items-center space-x-2 mb-6">
                <div className="h-1 w-12 bg-gradient-to-r from-gold to-royalBrown rounded-full"></div>
                <h2 className="text-2xl font-heading font-bold text-royalBrown">Order Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-sandBeige/30 to-white rounded-luxury-lg p-6 border border-gold/20 shadow-md">
                  <h3 className="font-heading font-semibold text-royalBrown mb-4 flex items-center">
                    <MapPin className="h-5 w-5 text-gold mr-2" />
                    Delivery Address
                  </h3>
                  <div className="space-y-2">
                    <p className="font-heading font-semibold text-royalBrown text-lg">{customerName}</p>
                    <p className="text-chocolate leading-relaxed">{deliveryAddress}</p>
                    <p className="text-chocolate font-medium">📞 {phoneNumber}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-sandBeige/30 to-white rounded-luxury-lg p-6 border border-gold/20 shadow-md">
                  <h3 className="font-heading font-semibold text-royalBrown mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gold/20">
                      <span className="text-chocolate font-medium">Order ID:</span>
                      <span className="font-heading font-bold text-royalBrown">{orderId}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gold/20">
                      <span className="text-chocolate font-medium">Order Date:</span>
                      <span className="text-royalBrown">{orderDate}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gold/20">
                      <span className="text-chocolate font-medium">Expected Delivery:</span>
                      <span className="text-royalBrown font-semibold">{deliveryDate}</span>
                    </div>
                    <div className="border-t-2 border-gold/30 my-3 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-heading font-bold text-royalBrown">Total Amount:</span>
                        <span className="text-2xl font-bold text-gold">{formatPrice(totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <Receipt 
                orderId={orderId}
                customerName={customerName}
                deliveryAddress={deliveryAddress}
                phoneNumber={phoneNumber}
                items={items}
                totalPrice={totalPrice}
                orderDate={orderDate}
                deliveryDate={deliveryDate}
              />
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <button
                  onClick={handleContinueShopping}
                  className="btn-primary inline-flex items-center justify-center px-8 py-3 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>Continue Shopping</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-chocolate to-royalBrown opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
                <button
                  onClick={() => setOrderPlaced(false)}
                  className="btn-outline inline-flex items-center justify-center px-8 py-3"
                >
                  View Order Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-cream via-sandBeige/50 to-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center animate-slide-up">
          <h1 className="text-5xl font-heading font-bold text-royalBrown mb-3 bg-gradient-to-r from-royalBrown to-chocolate bg-clip-text text-transparent">
            Checkout
          </h1>
          <p className="text-chocolate text-lg">Complete your order with confidence</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-luxury-lg shadow-luxury p-6 border border-gold/20 lg:sticky lg:top-8 h-fit animate-slide-up">
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-1 w-12 bg-gradient-to-r from-gold to-royalBrown rounded-full"></div>
              <h2 className="text-2xl font-heading font-bold text-royalBrown">Order Summary</h2>
            </div>
            <div className="space-y-4 mb-6">
              {items.map((item, index) => (
                <div 
                  key={item.id} 
                  className="flex items-center space-x-4 p-4 bg-sandBeige/30 rounded-luxury hover:bg-sandBeige/50 transition-colors"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative group flex-shrink-0">
                    <div className="absolute inset-0 bg-gold/20 rounded-luxury blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-luxury shadow-md relative z-10 group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-royalBrown mb-1 truncate">{item.name}</h3>
                    <p className="text-sm text-chocolate mb-1">Qty: {item.quantity}</p>
                    <p className="text-lg font-bold text-gold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3 border-t-2 border-gold/30 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-chocolate font-medium">Subtotal</span>
                <span className="font-semibold text-royalBrown">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-chocolate font-medium">Shipping</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gold/20 mt-3">
                <span className="text-xl font-heading font-bold text-royalBrown">Total</span>
                <span className="text-2xl font-bold text-gold">{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Customer & Payment Details */}
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {/* Customer Details */}
            <div className="bg-white rounded-luxury-lg shadow-luxury p-6 border border-gold/20">
              <div className="flex items-center space-x-2 mb-6">
                <div className="h-1 w-12 bg-gradient-to-r from-gold to-royalBrown rounded-full"></div>
                <h2 className="text-2xl font-heading font-bold text-royalBrown">Delivery Information</h2>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-royalBrown mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="input-field focus:shadow-gold"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-royalBrown mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="input-field focus:shadow-gold"
                    placeholder="Enter your phone number (e.g., +91 98765 43210)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-royalBrown mb-2">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    rows={4}
                    required
                    className="input-field focus:shadow-gold resize-none"
                    placeholder="Enter your complete delivery address including street, city, state, and pincode"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-luxury-lg shadow-luxury p-6 border border-gold/20">
              <div className="flex items-center space-x-2 mb-6">
                <div className="h-1 w-12 bg-gradient-to-r from-gold to-royalBrown rounded-full"></div>
                <h2 className="text-2xl font-heading font-bold text-royalBrown">Payment Method</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-5 border-2 border-gold/30 rounded-luxury hover:border-gold hover:shadow-gold transition-all cursor-pointer bg-gradient-to-r from-sandBeige/30 to-transparent">
                  <input
                    type="radio"
                    id="cod"
                    name="payment"
                    className="h-5 w-5 text-gold focus:ring-gold border-gold/50 cursor-pointer"
                    defaultChecked
                  />
                  <label htmlFor="cod" className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="block font-heading font-semibold text-royalBrown">Cash on Delivery (COD)</span>
                        <span className="text-sm text-chocolate">Pay when you receive your order</span>
                      </div>
                      <span className="text-sm font-bold text-gold">+ ₹30 COD charge</span>
                    </div>
                  </label>
                </div>

                <div className="flex items-center space-x-3 p-5 border-2 border-gold/20 rounded-luxury hover:border-gold hover:shadow-gold transition-all cursor-pointer">
                  <input
                    type="radio"
                    id="online"
                    name="payment"
                    className="h-5 w-5 text-gold focus:ring-gold border-gold/50 cursor-pointer"
                  />
                  <label htmlFor="online" className="flex-1 cursor-pointer">
                    <div>
                      <span className="block font-heading font-semibold text-royalBrown">Online Payment</span>
                      <span className="text-sm text-chocolate">Pay using UPI, Credit/Debit Card, or Net Banking</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Total</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  {false && ( // Show COD charge only if COD is selected
                    <div className="flex justify-between">
                      <span className="text-gray-600">COD Charge</span>
                      <span>₹30</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t mt-2">
                    <span>Total Amount</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || items.length === 0}
                  className={`w-full btn-primary mt-6 relative overflow-hidden group ${(isProcessing || items.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Placing Order...</span>
                      </>
                    ) : (
                      <>
                        <span>Place Order - {formatPrice(totalPrice)}</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-chocolate to-royalBrown opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>

                <p className="text-xs text-chocolate/70 mt-4 text-center">
                  🔒 Secure checkout • By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

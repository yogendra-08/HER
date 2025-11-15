/**
 * Enhanced Checkout Page Component for VastraVerse
 * Order confirmation, customer details, and order tracking
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Truck, Package, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import toast from 'react-hot-toast';

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
  const [orderId] = useState(`ORD${Math.floor(100000 + Math.random() * 900000)}`);
  const [customerName, setCustomerName] = useState('John Doe');
  const [deliveryAddress, setDeliveryAddress] = useState('123 Fashion Street, Mumbai, Maharashtra 400001');
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('PLACED');
  const { orderDate, deliveryDate } = getCurrentDate();
  const navigate = useNavigate();

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
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false);
      setOrderPlaced(true);
      clearCart();
      toast.success('Order placed successfully!');
      
      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="text-center mb-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
              <p className="text-gray-600">Thank you for shopping with VastraVerse.</p>
              <p className="text-sm text-gray-500 mt-2">Order ID: {orderId}</p>
            </div>

            {/* Order Status Timeline */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                {orderStatusSteps.map((step, index) => (
                  <div key={step.id} className="relative flex items-start mb-6">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step.completed ? 'bg-green-500' : step.active ? 'bg-blue-500' : 'bg-gray-200'}`}>
                      {step.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      ) : step.active ? (
                        <Clock className="h-5 w-5 text-white" />
                      ) : (
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Delivery Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">{customerName}</p>
                        <p className="text-gray-600">{deliveryAddress}</p>
                        <p className="text-gray-600">Phone: {phoneNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Order Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">{orderId}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Order Date:</span>
                      <span>{orderDate}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Expected Delivery:</span>
                      <span>{deliveryDate}</span>
                    </div>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between font-medium">
                      <span>Total Amount:</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/')}
                className="btn-primary inline-flex items-center"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-4 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                    <p className="font-medium">{formatPrice(item.product_price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t mt-2">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Customer & Payment Details */}
          <div className="space-y-6">
            {/* Customer Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full delivery address"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                  <input
                    type="radio"
                    id="cod"
                    name="payment"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    defaultChecked
                  />
                  <label htmlFor="cod" className="flex-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="block font-medium text-gray-900">Cash on Delivery (COD)</span>
                        <span className="text-sm text-gray-500">Pay when you receive your order</span>
                      </div>
                      <span className="text-sm font-medium">+ ₹30 COD charge</span>
                    </div>
                  </label>
                </div>

                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                  <input
                    type="radio"
                    id="online"
                    name="payment"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="online" className="flex-1">
                    <div>
                      <span className="block font-medium text-gray-900">Online Payment</span>
                      <span className="text-sm text-gray-500">Pay using UPI, Credit/Debit Card, or Net Banking</span>
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
                  className={`w-full btn-primary mt-6 ${(isProcessing || items.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isProcessing ? 'Placing Order...' : `Place Order - ${formatPrice(totalPrice)}`}
                </button>

                <p className="text-xs text-gray-500 mt-3 text-center">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

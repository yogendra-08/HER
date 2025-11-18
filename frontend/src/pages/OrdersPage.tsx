import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { orderAPI, type Order as ApiOrder } from '../utils/api';
import toast from 'react-hot-toast';

type OrderStatus = 'PLACED' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface DisplayOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<DisplayOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get logged-in user's email from localStorage
        const userJson = localStorage.getItem('vastraverse_user');
        let userEmail: string | null = null;
        
        if (userJson) {
          try {
            const user = JSON.parse(userJson);
            userEmail = user.email || null;
          } catch (e) {
            console.error('Error parsing user data:', e);
          }
        }
        
        let response;
        if (userEmail) {
          // Normalize email (trim and lowercase)
          const normalizedEmail = userEmail.trim().toLowerCase();
          console.log(`📦 Fetching orders for user: ${normalizedEmail}`);
          
          try {
            response = await orderAPI.getByUser(normalizedEmail);
          } catch (apiError: any) {
            console.error('API Error:', apiError);
            throw apiError;
          }
        } else {
          // If no user is logged in, show empty state
          console.log('⚠️ No user logged in, showing empty orders');
          setOrders([]);
          setLoading(false);
          return;
        }
        
        if (response && response.success && response.data && response.data.orders) {
          // Transform database orders to match the component's expected format
          const transformedOrders: DisplayOrder[] = response.data.orders.map((order: ApiOrder, index: number) => {
            // Handle MongoDB ObjectId format - it might be a string, object with _id, or _id property
            let orderId = '';
            if (order.id) {
              orderId = typeof order.id === 'string' ? order.id : (order.id.toString() || '');
            } else if ((order as any)._id) {
              orderId = typeof (order as any)._id === 'string' ? (order as any)._id : ((order as any)._id.toString() || '');
            } else {
              // Fallback: generate a temporary ID
              orderId = `temp-${Date.now()}-${index}`;
            }
            
            // Ensure orderId is a valid string before slicing
            const orderIdSuffix = orderId && orderId.length >= 6 
              ? orderId.slice(-6) 
              : (orderId || '000000').padStart(6, '0').slice(-6);
            
            return {
              id: orderId,
              orderNumber: `ORD-${orderIdSuffix.toUpperCase()}`,
              date: order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              status: (order.order_status || 'pending').toUpperCase().replace(/\s+/g, '_') as any,
              total: Number(order.total_amount) || 0,
              items: (order.products || []).map((product: any, idx: number) => ({
                id: `${orderId}-${idx}`,
                productId: (product.product_id || '').toString(),
                name: product.product_name || 'Product',
                price: Number(product.product_price) || 0,
                quantity: Number(product.quantity) || 1,
                image: product.product_image || '/api/placeholder/300/400',
              })),
              shippingAddress: {
                name: order.user_name || 'N/A',
                address: order.location || 'N/A',
                city: '',
                state: '',
                pincode: '',
                phone: order.user_phone || 'N/A',
              },
            };
          });
          
          setOrders(transformedOrders);
          console.log(`✅ Loaded ${transformedOrders.length} orders for user from database`);
        } else {
          const errorMsg = response?.message || 'Failed to fetch orders';
          console.error('Response error:', response);
          throw new Error(errorMsg);
        }
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load orders';
        console.error('Error details:', {
          message: errorMessage,
          status: err.response?.status,
          data: err.response?.data,
          userEmail: userJson ? JSON.parse(userJson).email : 'No user'
        });
        setError(errorMessage);
        toast.error(`Failed to load orders: ${errorMessage}`);
        
        // Fallback to empty array
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'PLACED':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'PACKED':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'SHIPPED':
        return <Truck className="h-5 w-5 text-blue-400" />;
      case 'OUT_FOR_DELIVERY':
        return <Truck className="h-5 w-5 text-orange-500" />;
      case 'DELIVERED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: OrderStatus) => {
    return status.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return 'bg-blue-100 text-blue-800';
      case 'PACKED':
        return 'bg-yellow-100 text-yellow-800';
      case 'PLACED':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-sandBeige/50 to-cream py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-8">
            <Package className="h-8 w-8 text-gold" />
            <h1 className="text-4xl font-heading font-bold text-royalBrown">My Orders</h1>
          </div>
          <div className="animate-pulse space-y-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-luxury-lg shadow-luxury p-6 border border-gold/20">
                <div className="h-6 bg-sandBeige rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-sandBeige rounded w-1/3 mb-6"></div>
                <div className="h-32 bg-sandBeige rounded mb-4"></div>
                <div className="h-10 bg-sandBeige rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-sandBeige/50 to-cream py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Package className="h-8 w-8 text-gold" />
            <h1 className="text-4xl font-heading font-bold text-royalBrown">My Orders</h1>
          </div>
          <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-6 rounded-luxury max-w-2xl mx-auto">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary px-6 py-3"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-sandBeige/50 to-cream py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gold/20 rounded-full blur-3xl animate-pulse"></div>
            <ShoppingBag className="h-32 w-32 mx-auto relative z-10 text-gold animate-bounce-gentle" />
          </div>
          <h1 className="text-4xl font-heading font-bold text-royalBrown mb-4">No Orders Yet</h1>
          <p className="text-chocolate text-lg mb-8">You haven't placed any orders yet. Start shopping to see your orders here!</p>
          <Link
            to="/products"
            className="btn-primary inline-flex items-center space-x-2 group"
          >
            <span>Continue Shopping</span>
            <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-sandBeige/50 to-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-8 animate-slide-up">
          <Package className="h-8 w-8 text-gold" />
          <h1 className="text-4xl font-heading font-bold text-royalBrown">My Orders</h1>
          <span className="text-chocolate text-lg">({orders.length} {orders.length === 1 ? 'order' : 'orders'})</span>
        </div>
        
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div 
              key={order.id} 
              className="bg-white rounded-luxury-lg shadow-luxury overflow-hidden border border-gold/20 hover:shadow-gold-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="px-6 py-5 flex justify-between items-center border-b border-gold/20 bg-gradient-to-r from-white to-sandBeige/20">
                <div>
                  <h3 className="text-xl leading-6 font-heading font-bold text-royalBrown">
                    Order #{order.orderNumber}
                  </h3>
                  <p className="mt-1 text-sm text-chocolate">
                    Placed on {new Date(order.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className={`inline-flex items-center px-4 py-2 rounded-luxury text-sm font-semibold ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-2">{getStatusText(order.status)}</span>
                </div>
              </div>
              
              <div className="border-b border-gold/20">
                <ul className="divide-y divide-gold/10">
                  {order.items.map((item) => (
                    <li key={item.id} className="p-5 flex hover:bg-sandBeige/20 transition-colors">
                      <div className="flex-shrink-0 h-24 w-24 rounded-luxury overflow-hidden bg-sandBeige/30 border border-gold/20 shadow-md">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="ml-5 flex-1 flex flex-col justify-center">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-heading font-semibold text-royalBrown">{item.name}</h3>
                            <p className="ml-4 text-xl font-bold text-gold">₹{Number(item.price).toLocaleString('en-IN')}</p>
                          </div>
                          <div className="flex items-center space-x-4 mt-2">
                            <p className="text-sm text-chocolate bg-sandBeige/50 px-3 py-1 rounded-luxury">
                              Qty: <span className="font-semibold text-royalBrown">{item.quantity}</span>
                            </p>
                            <p className="text-sm text-chocolate">
                              Amount: <span className="font-bold text-gold">₹{(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="px-6 py-5 flex justify-between items-center bg-gradient-to-r from-sandBeige/20 to-white">
                <div>
                  <p className="text-sm text-chocolate font-medium">Total Amount:</p>
                  <p className="text-2xl font-heading font-bold text-gold">₹{Number(order.total).toLocaleString('en-IN')}</p>
                </div>
                <div className="space-x-3">
                  <button
                    type="button"
                    className="btn-outline px-5 py-2.5 text-sm"
                  >
                    Track Order
                  </button>
                  <button
                    type="button"
                    className="btn-primary px-5 py-2.5 text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

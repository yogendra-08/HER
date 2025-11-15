import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react';

type OrderStatus = 'PLACED' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would be an API call to fetch orders
    const fetchOrders = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - replace with actual API call
        const mockOrders: Order[] = [
          {
            id: '1',
            orderNumber: 'ORD-2023-001',
            date: '2023-11-10',
            status: 'DELIVERED',
            total: 2499,
            items: [
              {
                id: '1',
                productId: '101',
                name: 'Classic White Shirt',
                price: 1299,
                quantity: 1,
                image: '/images/shirt.jpg'
              },
              {
                id: '2',
                productId: '102',
                name: 'Slim Fit Jeans',
                price: 1200,
                quantity: 1,
                image: '/images/jeans.jpg'
              }
            ],
            shippingAddress: {
              name: 'John Doe',
              address: '123 Main St',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400001',
              phone: '9876543210'
            }
          },
          {
            id: '2',
            orderNumber: 'ORD-2023-002',
            date: '2023-11-15',
            status: 'SHIPPED',
            total: 3499,
            items: [
              {
                id: '3',
                productId: '103',
                name: 'Casual T-Shirt',
                price: 599,
                quantity: 2,
                image: '/images/tshirt.jpg'
              },
              {
                id: '4',
                productId: '104',
                name: 'Cotton Chinos',
                price: 2300,
                quantity: 1,
                image: '/images/chinos.jpg'
              }
            ],
            shippingAddress: {
              name: 'John Doe',
              address: '123 Main St',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400001',
              phone: '9876543210'
            }
          }
        ];

        setOrders(mockOrders);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
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
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
          <div className="animate-pulse space-y-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white shadow rounded-lg p-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Orders</h1>
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
          <h1 className="mt-2 text-3xl font-bold text-gray-900">No Orders Yet</h1>
          <p className="mt-2 text-gray-600">You haven't placed any orders yet.</p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
        
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Order #{order.orderNumber}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Placed on {new Date(order.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1">{getStatusText(order.status)}</span>
                </div>
              </div>
              
              <div className="border-b border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <li key={item.id} className="p-4 flex">
                      <div className="flex-shrink-0 h-20 w-20 rounded-md overflow-hidden bg-gray-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{item.name}</h3>
                            <p className="ml-4">₹{item.price.toLocaleString('en-IN')}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <p className="font-medium text-gray-900">Total Amount:</p>
                  <p className="text-lg font-bold">₹{order.total.toLocaleString('en-IN')}</p>
                </div>
                <div className="space-x-3">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Track Order
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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

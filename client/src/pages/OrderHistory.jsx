import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import OrderTracking from '../components/OrderTracking';
import { Package, Calendar, CreditCard, ChevronRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-center text-red-600">
        <div className="bg-red-50 p-6 rounded-2xl inline-block">
            <p className="font-bold">{error}</p>
        </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div className="flex items-center gap-4">
            <div className="bg-primary-500 p-3 rounded-2xl text-white shadow-lg shadow-primary-200">
                <Package size={32} />
            </div>
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Order History</h1>
                <p className="text-gray-500 font-medium">Manage and track your book deliveries.</p>
            </div>
        </div>
        <Link to="/shop" className="flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
            <ShoppingBag size={18} /> Keep Shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-20 rounded-[2.5rem] shadow-sm border border-gray-100 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't started your collection yet. Browse our store to find your next favorite book!</p>
            <Link to="/shop" className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200">
                Go to Shop <ChevronRight size={18} />
            </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {orders.map((order) => (
            <div key={order.id} className="group bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500">
              {/* Header */}
              <div className="p-8 bg-gray-50/50 border-b border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Calendar size={14} />
                    <span className="text-[10px] uppercase font-bold tracking-widest">Order Placed</span>
                  </div>
                  <p className="font-bold text-gray-900">
                    {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <CreditCard size={14} />
                    <span className="text-[10px] uppercase font-bold tracking-widest">Total Amount</span>
                  </div>
                  <p className="font-extrabold text-gray-900 text-lg">₹ {Number(order.total_amount).toFixed(2)}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest">Order Reference</span>
                  </div>
                  <p className="font-mono text-xs font-bold text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-100 inline-block shadow-sm">
                    #{order.id.slice(0, 12).toUpperCase()}
                  </p>
                </div>
                <div className="flex justify-start md:justify-end items-center">
                  <span className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm ${
                    order.status === 'delivered' ? 'bg-emerald-500 text-white' :
                    order.status === 'shipped' ? 'bg-blue-500 text-white' :
                    order.status === 'paid' ? 'bg-indigo-500 text-white' :
                    'bg-amber-500 text-white'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Tracking View */}
              <div className="p-8 border-b border-gray-50">
                <OrderTracking 
                  status={order.status} 
                  trackingNumber={order.trackingNumber} 
                  carrierName={order.carrierName} 
                />
              </div>

              {/* Items List */}
              <div className="p-8 bg-white">
                <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-6">Shipment Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-6 p-4 rounded-2xl border border-gray-50 hover:border-gray-200 hover:bg-gray-50/30 transition-all group-item">
                        <div className="w-20 h-28 bg-gray-100 rounded-xl overflow-hidden shadow-sm flex-shrink-0 group-item-hover:scale-105 transition-transform duration-300">
                        {item.image_url ? (
                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-bold bg-gray-100 uppercase p-2 text-center">No Cover</div>
                        )}
                        </div>
                        <div className="flex-grow">
                            <h3 className="font-extrabold text-gray-900 text-lg mb-1">{item.title}</h3>
                            <p className="text-sm font-medium text-gray-500 mb-3">{item.author}</p>
                            <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Qty: {item.quantity}</span>
                                <span className="font-bold text-primary-600">₹ {Number(item.price).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
              </div>
              
              <div className="p-8 bg-gray-50/30 flex justify-between items-center">
                  <p className="text-sm text-gray-500 italic">Expected Delivery within 3-5 business days.</p>
                  <button className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors">
                      Need help with this order? <ChevronRight size={16} />
                  </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;

import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import OrderTracking from '../components/OrderTracking';
import { 
  Eye, 
  Truck, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Filter, 
  Package,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      setOrders(data || []);
    } catch (error) {
      toast.error('Error fetching admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      // If status is shipped, we might want to prompt for tracking info
      // But for simplicity in this flow, we update the status first
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
      fetchData(); 
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleUpdateTracking = async (orderId, trackingNumber, carrierName) => {
    try {
      await api.put(`/orders/${orderId}/status`, { 
        trackingNumber, 
        carrierName 
      });
      toast.success('Tracking information updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update tracking');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = (order.id && order.id.toLowerCase().includes(searchTerm.toLowerCase())) || 
                         (order.user_name && order.user_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 className="text-emerald-500" size={16} />;
      case 'shipped': return <Truck className="text-blue-500" size={16} />;
      case 'pending': return <Clock className="text-amber-500" size={16} />;
      default: return <Package className="text-gray-500" size={16} />;
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-gray-500 mt-1">Monitor and manage shipping logistics for all customers.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by ID or Name..."
                    className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none w-64 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <select 
                className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
            >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
            </select>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <div key={order.id} className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 ${expandedOrderId === order.id ? 'border-primary-500 ring-1 ring-primary-500' : 'border-gray-100 hover:border-gray-200'}`}>
            <div 
              className="p-6 cursor-pointer"
              onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
            >
              <div className="flex flex-wrap justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                        order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
                        order.status === 'shipped' ? 'bg-blue-50 text-blue-600' :
                        'bg-amber-50 text-amber-600'
                    }`}>
                        <Package size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-gray-400">Order</span>
                            <span className="font-bold text-gray-900">#{order.id.slice(0, 8)}...</span>
                        </div>
                        <div className="text-sm font-medium text-gray-500">{order.user_name} ({order.user_email})</div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-8">
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Total Amount</p>
                        <p className="font-bold text-gray-900 text-lg">₹{Number(order.total_amount).toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Date</p>
                        <p className="font-bold text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1 text-center">Current Status</p>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 
                            order.status === 'paid' ? 'bg-indigo-100 text-indigo-700' : 
                            'bg-amber-100 text-amber-700'
                        }`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                        </span>
                    </div>
                    {expandedOrderId === order.id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                </div>
              </div>
            </div>

            {expandedOrderId === order.id && (
              <div className="px-6 pb-8 pt-2 border-t border-gray-50 animate-in slide-in-from-top-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Detailed Tracking */}
                    <div>
                        <h3 className="text-sm font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                            <Truck size={18} /> Shipping Lifecycle
                        </h3>
                        <OrderTracking 
                            status={order.status} 
                            trackingNumber={order.trackingNumber} 
                            carrierName={order.carrierName} 
                        />
                        
                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Management Controls</h4>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex-grow min-w-[200px]">
                                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Update Master Status</label>
                                    <select 
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50"
                                        value={order.status}
                                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                                {order.status === 'shipped' && (
                                    <div className="flex-grow flex gap-2">
                                        <div className="flex-grow">
                                            <label className="block text-[10px] font-bold text-gray-500 mb-1">Carrier & Tracking ID</label>
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. FedEx"
                                                    className="w-1/3 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                                                    defaultValue={order.carrierName}
                                                    onBlur={(e) => handleUpdateTracking(order.id, order.trackingNumber, e.target.value)}
                                                />
                                                <input 
                                                    type="text" 
                                                    placeholder="Tracking ID"
                                                    className="w-2/3 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                                                    defaultValue={order.trackingNumber}
                                                    onBlur={(e) => handleUpdateTracking(order.id, e.target.value, order.carrierName)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Order Content & Delivery */}
                    <div className="space-y-6">
                        <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                            <h3 className="text-sm font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                                <Eye size={18} /> Ordered Content
                            </h3>
                            <div className="space-y-3">
                                {order.items?.map(item => (
                                    <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 font-bold">
                                                {item.quantity}x
                                            </div>
                                            <span className="font-bold text-gray-800 text-sm truncate max-w-[180px]">{item.title}</span>
                                        </div>
                                        <div className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {order.shippingAddress && (
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <MapPin size={14} /> Shipping Destination
                                </h3>
                                <div className="space-y-1 text-sm font-medium">
                                    <p className="font-bold text-gray-900 text-base">{order.shippingAddress.fullName}</p>
                                    <p className="text-gray-500">{order.shippingAddress.street}</p>
                                    <p className="text-gray-500">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}</p>
                                    <p className="text-primary-600 pt-2 font-bold">{order.shippingAddress.phone}</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter">
                                    <span className="text-gray-400">Payment Method</span>
                                    <span className="text-gray-900 bg-gray-100 px-2 py-1 rounded">{order.paymentMethod}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-2xl p-16 text-center border-2 border-dashed border-gray-100">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={40} className="text-gray-300" />
            </div>
            <p className="text-gray-900 font-bold text-xl">No Matching Orders</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;

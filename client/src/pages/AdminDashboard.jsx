import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  Package,
  Calendar,
  User
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/orders/stats');
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Hello, Store Manager. Here's what's happening today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-lg transition-all">
          <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Revenue</p>
            <p className="text-2xl font-black text-gray-900">₹{stats?.totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-lg transition-all">
          <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Orders</p>
            <p className="text-2xl font-black text-gray-900">{stats?.totalOrders}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-lg transition-all">
          <div className="bg-amber-50 p-4 rounded-2xl text-amber-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pending</p>
            <p className="text-2xl font-black text-gray-900">{stats?.pendingOrders}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-lg transition-all border-l-4 border-l-red-500">
          <div className="bg-red-50 p-4 rounded-2xl text-red-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Low Stock</p>
            <p className="text-2xl font-black text-gray-900">{stats?.lowStockBooks}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="text-primary-500" size={20} /> Recent Shipments
            </h2>
            <Link to="/admin/orders" className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="space-y-4">
            {stats?.recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 border border-gray-50 hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 text-gray-400">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{order.user}</p>
                    <p className="text-[10px] font-mono text-gray-400 uppercase">{order.id.slice(0, 8)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{Number(order.amount).toFixed(2)}</p>
                  <p className="text-[10px] text-gray-400 font-bold">{new Date(order.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Center */}
        <div className="space-y-6">
            <div className="bg-primary-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary-100 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 bg-primary-500/30 w-32 h-32 rounded-full scale-150 transition-transform group-hover:scale-175" />
                <h3 className="text-lg font-bold mb-2 relative z-10">Quick Actions</h3>
                <p className="text-primary-100 text-sm mb-6 relative z-10">Streamline your workflow with one-click access.</p>
                
                <div className="space-y-3 relative z-10">
                    <Link to="/admin/books" className="flex items-center justify-between w-full bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all border border-white/10">
                        <span className="font-bold text-sm">Add New Book</span>
                        <ArrowRight size={16} />
                    </Link>
                    <Link to="/admin/orders" className="flex items-center justify-between w-full bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all border border-white/10">
                        <span className="font-bold text-sm">Manage Logistics</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-gray-200">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-primary-400" /> System Status
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                        <span className="text-xs text-gray-400 font-bold">API Server</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-black uppercase">Online</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                        <span className="text-xs text-gray-400 font-bold">Database</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-black uppercase">Connected</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                        <span className="text-xs text-gray-400 font-bold">Email Service</span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-black uppercase">Simulation</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

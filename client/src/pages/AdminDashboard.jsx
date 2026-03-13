import { useState, useEffect } from 'react';
import { BarChart3, Users, DollarSign, ShoppingBag } from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalBooks: 0
  });

  useEffect(() => {
    // In a real app we'd have a specific /api/reports endpoint.
    // For now, we simulate fetching aggregated data safely.
    const fetchStats = async () => {
      try {
        const [ordersRes, usersRes, booksRes] = await Promise.all([
          api.get('/orders'),
          api.get('/users'),
          api.get('/books')
        ]);

        const orders = ordersRes.data;
        const totalSales = orders.reduce((acc, order) => acc + Number(order.total_amount), 0);

        setStats({
          totalSales,
          totalOrders: orders.length,
          totalUsers: usersRes.data.length,
          totalBooks: booksRes.data.totalBooks || booksRes.data.books?.length || 0
        });
      } catch (error) {
        console.error('Failed to load dashboard stats', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900">₹{stats.totalSales.toLocaleString('en-IN')}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalOrders}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Registered Users</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
            <BarChart3 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Books Catalog</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalBooks}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 flex flex-col items-center justify-center">
         <BarChart3 size={64} className="text-gray-200 mb-4" />
         <h3 className="text-lg font-medium text-gray-900">Advanced Analytics Available in Phase 3</h3>
         <p className="text-gray-500 max-w-sm text-center mt-2">Charts, sales velocity tracking, and demographic mapping modules require external charting libraries.</p>
      </div>

    </div>
  );
};

export default AdminDashboard;

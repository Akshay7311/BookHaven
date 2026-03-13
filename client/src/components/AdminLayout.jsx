import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, Package, Users, Settings } from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-100 flex flex-col transition-all duration-300">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors">
            <BookOpen className="h-6 w-6" />
            <span className="font-bold text-xl tracking-tight text-white">BookHaven HQ</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Management
            </p>
            <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
              <BookOpen className="h-5 w-5" />
              Dashboard
            </Link>
            <Link to="/admin/books" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
              <BookOpen className="h-5 w-5" />
              Books
            </Link>
            <Link to="/admin/categories" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
              <BookOpen className="h-5 w-5" />
              Categories
            </Link>
            <Link to="/admin/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
              <Package className="h-5 w-5" />
              Orders
            </Link>
            <Link to="/admin/customers" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
              <Users className="h-5 w-5" />
              Customers
            </Link>
            <Link to="/admin/coupons" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
               <Package className="h-5 w-5" />
               Coupons
            </Link>
            <Link to="/admin/banners" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
               <Package className="h-5 w-5" />
               Banners
            </Link>
            <Link to="/admin/messages" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
               <Users className="h-5 w-5" />
               Messages
            </Link>
            <Link to="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-red-400 hover:text-red-300 hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 border-b border-gray-200 z-10">
          <h2 className="text-lg font-semibold text-gray-800">Admin Controls</h2>
          <div className="text-sm text-gray-500">
             <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">Return to Storefront</Link>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          {/* This renders specifically the nested routes */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

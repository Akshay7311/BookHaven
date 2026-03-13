import { NavLink, Outlet } from 'react-router-dom';
import { User, Package, Heart, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfileLayout = () => {
  const { user } = useAuth();

  const links = [
    { name: 'My Orders', to: '/profile/orders', icon: Package },
    { name: 'Wishlist', to: '/profile/wishlist', icon: Heart },
    { name: 'Settings', to: '/profile/settings', icon: Settings }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xl uppercase overflow-hidden shadow-sm">
                {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    user?.name?.charAt(0) || 'U'
                )}
              </div>
              <div>
                <h2 className="font-bold text-gray-900 leading-tight">{user?.name}</h2>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <nav className="space-y-2">
              {links.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <link.icon size={18} />
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[500px]">
             <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;

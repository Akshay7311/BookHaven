import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingCart, User, LogOut, BookOpen, Search, Heart, Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = ["Web Novel", "Comics", "Fiction", "Non-fiction", "Science", "History", "Manga", "Light Novel"];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
      e.preventDefault();
      // Route identically to our existing /shop or / (since currently / is handling search)
      // I'll route it to /shop according to the Phase 3 plan, assuming we build Shop.jsx next.
      let query = `?keyword=${encodeURIComponent(searchKeyword)}`;
      if (searchCategory) query += `&category=${encodeURIComponent(searchCategory)}`;
      navigate(`/shop${query}`);
  };

  return (
    <header className="w-full flex flex-col z-50 sticky top-0 bg-white">
      {/* Main Amazon-Style Header */}
      <div className="bg-slate-900 border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20 gap-4 lg:gap-8">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 text-white hover:text-primary-200 transition-colors">
                <BookOpen className="h-8 w-8 text-primary-400" />
                <span className="font-extrabold text-2xl tracking-tight hidden sm:block">BookHaven</span>
            </Link>
            
            {/* Central Search Bar (Amazon Style) */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-grow max-w-3xl focus-within:ring-2 focus-within:ring-primary-400 rounded-md overflow-hidden bg-white h-11">
                {/* Category Dropdown (Left pseudo-select) */}
                <div relative="true" className="flex items-center bg-gray-100 border-r border-gray-300 text-gray-700 hover:bg-gray-200 cursor-pointer px-3">
                    <select 
                        value={searchCategory}
                        onChange={(e) => setSearchCategory(e.target.value)}
                        className="bg-transparent text-sm focus:outline-none appearance-none pr-4 cursor-pointer"
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={14} className="-ml-3 pointer-events-none text-gray-500"/>
                </div>
                {/* Search Input */}
                <input 
                    type="text" 
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Search by title, author, or keyword"
                    className="flex-grow px-4 text-gray-900 outline-none text-sm"
                />
                {/* Search Button */}
                <button type="submit" className="bg-primary-500 hover:bg-primary-600 px-6 flex items-center justify-center transition-colors">
                    <Search size={20} className="text-white" />
                </button>
            </form>

            {/* Right Icons */}
            <div className="flex items-center gap-2 sm:gap-6 flex-shrink-0">
                {/* User Dropdown */}
                {user ? (
                <div className="group relative">
                    <button className="flex items-center gap-2 hover:text-gray-300 transition-colors p-2 rounded-md hover:bg-white/10">
                        {user.avatar ? (
                            <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full border border-gray-600 object-cover" />
                        ) : (
                            <User className="h-6 w-6" />
                        )}
                        <div className="hidden lg:flex flex-col text-left">
                            <span className="text-[10px] text-gray-400 leading-none">Hello, {user.name.split(' ')[0]}</span>
                            <span className="text-sm font-bold leading-none mt-1 flex items-center gap-1">Account & Lists <ChevronDown size={14}/></span>
                        </div>
                    </button>
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <p className="font-bold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="py-2 flex flex-col">
                        {user.role === 'admin' && (
                            <Link to="/admin" className="px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 font-medium border-b border-gray-100">
                                ⚙️ Admin Dashboard
                            </Link>
                        )}
                        <Link to="/profile" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
                        <Link to="/profile/orders" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Orders</Link>
                        <Link to="/profile/wishlist" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Wishlist</Link>
                        <button onClick={handleLogout} className="text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 mt-1 border-t border-gray-100 flex items-center gap-2">
                        <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                    </div>
                    </div>
                </div>
                ) : (
                <div className="flex items-center gap-3">
                    <div className="hidden lg:flex flex-col text-right">
                        <span className="text-[10px] text-gray-400 leading-none">Hello, sign in</span>
                        <Link to="/login" className="text-sm font-bold leading-none mt-1 hover:underline">Accounts & Lists</Link>
                    </div>
                    <Link to="/login" className="lg:hidden p-2 hover:bg-white/10 rounded-md">
                         <User className="h-6 w-6" />
                    </Link>
                </div>
                )}

                {/* Wishlist Icon */}
                <Link to={user ? "/profile/wishlist" : "/login"} className="relative hover:text-gray-300 transition-colors p-2 rounded-md hover:bg-white/10 hidden sm:block delay-100">
                   <div className="flex flex-col items-center">
                    <Heart className="h-6 w-6" />
                    <span className="text-[10px] font-bold absolute bottom-0 right-0 bg-red-500 text-white rounded-full px-1.5 translate-x-1/4 translate-y-1/4">{wishlistCount}</span>
                   </div>
                </Link>

                {/* Cart Icon */}
                <Link to="/cart" className="relative hover:text-gray-300 transition-colors p-2 rounded-md hover:bg-white/10 flex items-end gap-1">
                    <div className="relative">
                        <ShoppingCart className="h-8 w-8" />
                        <span className="absolute -top-1 right-0 bg-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1/2 shadow-sm border border-primary-900 border-2">
                        {cartCount}
                        </span>
                    </div>
                    <span className="hidden lg:block font-bold mt-auto pb-1 text-sm tracking-wide">Cart</span>
                </Link>

                {/* Mobile Menu Toggle */}
                <button 
                  className="md:hidden p-2 text-gray-300 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>
            </div>

            {/* Mobile Search Bar (Only visible on small screens) */}
            <div className="md:hidden pb-4 px-1">
                <form onSubmit={handleSearchSubmit} className="flex flex-grow focus-within:ring-2 focus-within:ring-primary-400 rounded-md overflow-hidden bg-white h-10 shadow-inner">
                    <input 
                        type="text" 
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="Search books..."
                        className="flex-grow px-3 text-gray-900 outline-none text-sm"
                    />
                    <button type="submit" className="bg-primary-500 hover:bg-primary-600 px-4 flex items-center justify-center transition-colors">
                        <Search size={18} className="text-white" />
                    </button>
                </form>
            </div>
        </div>
      </div>

      {/* Secondary Navigation Menu */}
      <div className="bg-slate-800 text-white border-b border-slate-900 hidden md:block shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-10 gap-6 text-sm font-medium">
            <Link to="/shop" className="hover:text-gray-300 transition-colors border border-transparent hover:border-slate-600 px-2 py-1 rounded">All Store</Link>
            <Link to="/shop?sort=newest" className="hover:text-gray-300 transition-colors border border-transparent hover:border-slate-600 px-2 py-1 rounded">New Arrivals</Link>
            <Link to="/shop?sort=popular" className="hover:text-gray-300 transition-colors border border-transparent hover:border-slate-600 px-2 py-1 rounded">Best Sellers</Link>
            <div className="h-4 w-px bg-slate-600 mx-2"></div>
            {categories.slice(0, 5).map(cat => (
                 <Link key={cat} to={`/shop?category=${encodeURIComponent(cat)}`} className="hover:text-gray-300 transition-colors border border-transparent hover:border-slate-600 px-2 py-1 rounded">
                     {cat}
                 </Link>
            ))}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
         <div className="md:hidden bg-white border-b border-gray-200 shadow-xl absolute top-full left-0 w-full z-40 max-h-[80vh] overflow-y-auto slide-in">
             <div className="p-4 flex flex-col space-y-4">
                 <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-2">Shop All Books</Link>
                 <div className="flex flex-col space-y-3">
                     <p className="font-bold text-gray-500 text-xs uppercase tracking-wider">Top Categories</p>
                     {categories.map(cat => (
                         <Link key={cat} to={`/shop?category=${encodeURIComponent(cat)}`} onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 font-medium pl-2">
                             {cat}
                         </Link>
                     ))}
                 </div>
                 <div className="border-t border-gray-100 pt-4 flex flex-col space-y-3">
                     <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 font-medium">About Us</Link>
                     <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 font-medium">Contact Service</Link>
                 </div>
             </div>
         </div>
      )}

    </header>
  );
};

export default Navbar;

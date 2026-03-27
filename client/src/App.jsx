import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import PublicLayout from './components/PublicLayout';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import BookDetails from './pages/BookDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderHistory from './pages/OrderHistory';
import ProfileLayout from './pages/ProfileLayout';
import ProfileSettings from './pages/ProfileSettings';
import ProfileWishlist from './pages/ProfileWishlist';
import AdminDashboard from './pages/AdminDashboard';
import AdminBooks from './pages/AdminBooks';
import AdminOrders from './pages/AdminOrders';
import AdminCustomers from './pages/AdminCustomers';
import AdminSettings from './pages/AdminSettings';

import AdminCategories from './pages/AdminCategories';
import AdminCoupons from './pages/AdminCoupons';
import AdminBanners from './pages/AdminBanners';
import AdminMessages from './pages/AdminMessages';

import AboutUs from './pages/AboutUs';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import ShippingPolicy from './pages/ShippingPolicy';
import ContactUs from './pages/ContactUs';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Toaster position="bottom-right" reverseOrder={false} />
          <Routes>
            {/* Public and Standard User Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/books/:id" element={<BookDetails />} />
              
              {/* Static Pages */}
              <Route path="/about" element={<AboutUs />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/shipping" element={<ShippingPolicy />} />
              <Route path="/contact" element={<ContactUs />} />

              {/* Protected Routes (Logged in users) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                
                {/* Unified Profile Layout */}
                <Route path="/profile" element={<ProfileLayout />}>
                  <Route index element={<OrderHistory />} /> {/* Default to orders */}
                  <Route path="orders" element={<OrderHistory />} />
                  <Route path="wishlist" element={<ProfileWishlist />} />
                  <Route path="settings" element={<ProfileSettings />} />
                </Route>
              </Route>
              
              {/* Catch All 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Completely Isolated Admin App */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/books" element={<AdminBooks />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/coupons" element={<AdminCoupons />} />
                <Route path="/admin/banners" element={<AdminBanners />} />
                <Route path="/admin/messages" element={<AdminMessages />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/customers" element={<AdminCustomers />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

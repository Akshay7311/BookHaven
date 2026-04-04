import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchWishlist = async () => {
    if (!user) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const { data } = await api.get('/wishlist');
      setWishlistItems(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (bookId) => {
    if (!user) return;
    try {
        await api.post('/wishlist/toggle', { bookId });
        await fetchWishlist();
    } catch (e) {
        console.error("Wishlist Toggle Failed", e);
    }
  };

  const isInWishlist = (bookId) => {
    return wishlistItems.some(item => item.id === bookId || item.bookId === bookId);
  };

  const wishlistCount = wishlistItems.length;

  const value = {
    wishlistItems,
    wishlistCount,
    loading,
    fetchWishlist,
    toggleWishlist,
    isInWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

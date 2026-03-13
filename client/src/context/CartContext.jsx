import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const { data } = await api.get('/cart');
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (bookId, quantity = 1) => {
    if (!user) throw new Error('Must be logged in to add to cart');
    try {
        await api.post('/cart', { bookId, quantity });
        await fetchCart();
    } catch (e) {
        console.error("Cart Add Failed", e);
        throw e;
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (!user) return;
    try {
        await api.put(`/cart/${cartItemId}`, { quantity });
        await fetchCart();
    } catch (e) {
        console.error("Cart Update Failed", e);
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!user) return;
    try {
        await api.delete(`/cart/${cartItemId}`);
        await fetchCart();
    } catch (e) {
        console.error("Cart Delete Failed", e);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const safeItems = Array.isArray(cartItems) ? cartItems : [];
  const cartTotal = safeItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  const cartCount = safeItems.reduce((count, item) => count + item.quantity, 0);

  const value = {
    cartItems: safeItems,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

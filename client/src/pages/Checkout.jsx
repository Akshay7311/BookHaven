import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Redirect if empty
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post('/orders');
      clearCart();
      // Optional: Redirect to a success page or order history
      navigate('/my-orders');
      alert('Order placed successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Checkout</h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-center shadow-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
          
          <ul className="divide-y divide-gray-100 mb-6">
            {cartItems.map((item) => (
              <li key={item.id} className="py-4 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="font-medium text-gray-900 mr-2">{item.quantity} x</span>
                  <span className="text-gray-600 line-clamp-1">{item.title}</span>
                </div>
                <span className="font-medium text-gray-900 ml-4">
                  ₹ {(Number(item.price) * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-100 pt-6">
            <div className="flex justify-between items-center text-2xl font-bold text-gray-900">
              <span>Total to Pay:</span>
              <span className="text-primary-600">₹ {cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 md:p-8 border-t border-gray-100">
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full btn-primary py-4 text-lg shadow-md"
          >
            {loading ? 'Processing...' : 'Place Order Now'}
          </button>
          <p className="text-center text-sm text-gray-500 mt-4">
            Payment processing is simulated for this demo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

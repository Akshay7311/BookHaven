import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { 
  MapPin, 
  CreditCard, 
  Truck, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck,
  ShoppingBag,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Form states
  const [addressData, setAddressData] = useState({
    fullName: '',
    phone: '',
    zipCode: '',
    street: '',
    city: '',
    state: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const shippingPrice = cartTotal > 1000 ? 0 : 150;
  const finalTotal = Math.max(0, cartTotal - discountAmount) + shippingPrice;

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressData(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setLoading(true);
    try {
      const { data } = await api.post('/coupons/validate', { code: couponCode });
      setAppliedCoupon(data);
      const discount = cartTotal * (data.discount_percentage / 100);
      setDiscountAmount(discount);
      toast.success(`Coupon Applied! Saved ₹${discount.toFixed(0)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon code');
      setAppliedCoupon(null);
      setDiscountAmount(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderPayload = {
        shippingAddress: addressData,
        paymentMethod,
        shippingPrice,
        couponCode: appliedCoupon?.code || null
      };
      
      const { data } = await api.post('/orders', orderPayload);

      // Handle Razorpay Logic if API returns Razorpay Payload
      if (data.razorpayPayload) {
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
          throw new Error('Payment gateway failed to load. Please check your connection.');
        }

        const options = {
          key: data.razorpayPayload.keyId,
          amount: data.razorpayPayload.amount,
          currency: 'INR',
          name: 'BookHaven',
          description: 'Payment for your books',
          order_id: data.razorpayPayload.orderId,
          handler: async function (response) {
            try {
              toast.loading('Verifying payment...', { id: 'verifyPayment' });
              await api.post('/orders/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: data.orderId
              });
              toast.success('Payment Verification Success!', { id: 'verifyPayment' });
              
              navigate(`/order-success?id=${data.orderId}`);
              clearCart();
            } catch (vErr) {
              toast.error(vErr.response?.data?.message || 'Verification failed. Contact support.', { id: 'verifyPayment' });
            }
          },
          prefill: {
            name: addressData.fullName,
            contact: addressData.phone,
          },
          theme: { color: '#0ea5e9' } // Primary-500
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response) {
          toast.error(`Payment failed: ${response.error.description}`);
        });
        rzp1.open();
        setLoading(false); // Enable buttons immediately while modal is up

      } else {
        // Direct Flow (COD or fake Card fallback if keys missing)
        navigate(`/order-success?id=${data.orderId}`);
        clearCart();
        toast.success('Success! Your books are on the way.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Transaction failed. Please try again.');
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      const required = ['fullName', 'street', 'city', 'zipCode', 'phone'];
      const missing = required.filter(field => !addressData[field]);
      if (missing.length > 0) {
        toast.error('Please fill in all required shipping fields');
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Left Side: Steps */}
        <div className="flex-grow">
          {/* Progress Indicators */}
          <div className="relative flex justify-between mb-12 max-w-sm mx-auto">
            {[1, 2, 3].map((s) => (
              <div key={s} className="relative z-10 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  step >= s ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'bg-gray-200 text-gray-400'
                }`}>
                  {s}
                </div>
                <span className={`text-[9px] mt-2 font-bold uppercase tracking-widest ${step >= s ? 'text-primary-600' : 'text-gray-400'}`}>
                  {s === 1 ? 'Shipping' : s === 2 ? 'Payment' : 'Review'}
                </span>
              </div>
            ))}
            <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-100 -z-0" />
            <div 
              className="absolute top-4 left-0 h-0.5 bg-primary-600 -z-0 transition-all duration-500" 
              style={{ width: `${(step - 1) * 50}%` }}
            />
          </div>

          <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-100/50 border border-gray-50 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="p-8 md:p-12">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                  <MapPin className="text-primary-500" /> Shipping Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                    <input 
                      type="text" name="fullName" value={addressData.fullName} onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                    <input 
                      type="text" name="phone" value={addressData.phone} onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">ZIP Code</label>
                    <input 
                      type="text" name="zipCode" value={addressData.zipCode} onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="110001"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Street Address</label>
                    <input 
                      type="text" name="street" value={addressData.street} onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="House No., Street name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">City</label>
                    <input 
                      type="text" name="city" value={addressData.city} onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="New Delhi"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">State</label>
                    <input 
                      type="text" name="state" value={addressData.state} onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="Delhi"
                    />
                  </div>
                </div>
                <button 
                  onClick={nextStep}
                  className="mt-10 w-full bg-primary-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary-200 flex items-center justify-center gap-2 hover:bg-primary-700 active:scale-[0.98] transition-all"
                >
                  Continue to Payment <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="p-8 md:p-12">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                  <CreditCard className="text-primary-500" /> Payment Method
                </h2>
                <div className="space-y-4">
                  {[
                    { id: 'Card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Secure payment via SSL encrypted gateway' },
                    { id: 'PayPal', label: 'PayPal Checkout', icon: ShoppingBag, desc: 'Faster checkout with your PayPal account' },
                    { id: 'COD', label: 'Cash on Delivery', icon: Truck, desc: 'Pay when your package reaches your doorstep' },
                  ].map((method) => (
                    <div 
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentMethod === method.id ? 'border-primary-500 bg-primary-50/30 shadow-lg shadow-primary-100' : 'border-gray-50 hover:border-gray-200 bg-gray-50/10'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl transition-colors ${paymentMethod === method.id ? 'bg-primary-600 text-white' : 'bg-white text-gray-400 border border-gray-100'}`}>
                          <method.icon size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{method.label}</p>
                          <p className="text-xs text-gray-500 font-medium">{method.desc}</p>
                        </div>
                      </div>
                      {paymentMethod === method.id && (
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white scale-110 shadow-lg shadow-primary-200">
                          <ShieldCheck size={14} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-10">
                  <button onClick={prevStep} className="flex-1 bg-white border border-gray-200 text-gray-600 font-bold py-4 rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                    <ChevronLeft size={18} /> Back
                  </button>
                  <button onClick={nextStep} className="flex-[2] bg-primary-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary-200 transition-all hover:bg-primary-700 flex items-center justify-center gap-2">
                    Review Order <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="p-8 md:p-12">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                  <ShieldCheck className="text-primary-500" /> Final Review
                </h2>
                
                <div className="bg-gray-50/50 rounded-2xl p-8 border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Shipping Address</h4>
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <p className="font-bold text-gray-900">{addressData.fullName}</p>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                          {addressData.street}, {addressData.city}<br />
                          {addressData.state} - {addressData.zipCode}
                        </p>
                        <p className="text-sm font-bold text-gray-400 mt-3">{addressData.phone}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Payment Detail</h4>
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="bg-primary-50 text-primary-600 p-2 rounded-lg">
                          <CreditCard size={20} />
                        </div>
                        <p className="font-bold text-gray-900">{paymentMethod}</p>
                      </div>
                      <div className="mt-4 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex items-center gap-3">
                        <ShieldCheck size={18} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Transaction Secured</span>
                      </div>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 mb-10">
                  <Info size={20} className="flex-shrink-0" />
                  <p className="text-xs font-semibold leading-relaxed">By clicking "Place Order", you agree to our Terms of Service and clarify that the provided information is correct for delivery.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={prevStep} className="flex-1 bg-white border border-gray-200 text-gray-600 font-bold py-4 rounded-2xl hover:bg-gray-50 transition-all">
                    Back
                  </button>
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-[2] bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-gray-200 transition-all hover:bg-black active:scale-95 disabled:opacity-50"
                  >
                    {loading ? 'Processing Transaction...' : `Confirm & Place Order • ₹${finalTotal.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:w-96">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-100/50 border border-gray-50 p-8 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100 flex items-center gap-2">
              <ShoppingBag size={18} /> Order Summary
            </h3>
            <div className="space-y-5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-8">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center gap-4 group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-12 h-16 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-gray-400 group-hover:scale-105 transition-transform overflow-hidden">
                        {item.image_url ? (
                            <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                        ) : 'IMG'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-800 text-sm truncate">{item.title}</p>
                      <p className="text-xs text-gray-400 font-medium">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-gray-900 text-sm flex-shrink-0">₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 pt-6 border-t border-gray-50">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium">Order Subtotal</span>
                <span className="font-bold text-gray-800">₹{cartTotal.toFixed(2)}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span className="font-medium flex items-center gap-1">
                    Coupon ({appliedCoupon.code})
                    <button onClick={() => { setAppliedCoupon(null); setDiscountAmount(0); setCouponCode(''); }} className="text-red-400 hover:text-red-600 ml-1">×</button>
                  </span>
                  <span className="font-bold">- ₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium">Shipping Fee</span>
                <span className={`font-bold ${shippingPrice === 0 ? 'text-emerald-500' : 'text-gray-800'}`}>
                  {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice.toFixed(2)}`}
                </span>
              </div>
              
              {/* Coupon Input */}
              {!appliedCoupon && (
                <div className="pt-4 pb-2">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={couponCode} 
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Promo Code"
                      className="flex-grow bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary-500 uppercase tracking-widest"
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      disabled={loading || !couponCode}
                      className="bg-gray-900 text-white text-[10px] font-bold px-4 rounded-lg hover:bg-black disabled:opacity-50 transition-all uppercase tracking-tighter"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-between text-xl font-black text-gray-900 pt-6 mt-6 border-t-2 border-dashed border-gray-100">
                <span>Payable Total</span>
                <span className="text-primary-600">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {shippingPrice > 0 && (
              <div className="mt-6 flex items-center gap-3 bg-primary-50 p-3 rounded-xl border border-primary-100">
                <div className="bg-primary-500 text-white p-1 rounded-md">
                   <Truck size={14} />
                </div>
                <p className="text-[10px] text-primary-700 font-bold leading-tight uppercase tracking-tight">
                  Add ₹{(1000 - cartTotal).toFixed(0)} more for<br/> FREE SHIPPING
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;

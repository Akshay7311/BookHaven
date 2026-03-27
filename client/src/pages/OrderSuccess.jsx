import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, ShoppingBag } from 'lucide-react';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Celebration Icon */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-25" />
          <div className="relative bg-emerald-500 text-white p-6 rounded-full shadow-2xl shadow-emerald-200">
            <CheckCircle2 size={64} strokeWidth={2.5} />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Order Confirmed!</h1>
          <p className="text-gray-500 font-medium px-4">
            Thank you for your purchase. We've received your order and our team is already preparing your books!
          </p>
        </div>

        {/* Order Card */}
        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-xl shadow-gray-100/50">
          <div className="flex items-center justify-center gap-2 text-gray-400 mb-2">
            <Package size={16} />
            <span className="text-[10px] uppercase font-bold tracking-widest">Order Reference</span>
          </div>
          <p className="font-mono text-xl font-black text-primary-600 mb-6">
            #{orderId?.slice(0, 12).toUpperCase()}
          </p>
          <div className="space-y-3">
            <Link 
              to="/profile/orders" 
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg active:scale-95"
            >
              Track Your Order <ArrowRight size={18} />
            </Link>
            <Link 
              to="/shop" 
              className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-95"
            >
              <ShoppingBag size={18} /> Continue Shopping
            </Link>
          </div>
        </div>

        <p className="text-xs text-gray-400 font-medium">
          A confirmation email will be sent to your registered email address shortly.
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;

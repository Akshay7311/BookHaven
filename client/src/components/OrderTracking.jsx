import { CheckCircle2, Circle, Package, Truck, Home, Clock } from 'lucide-react';

const OrderTracking = ({ status, trackingNumber, carrierName }) => {
  const steps = [
    { id: 'pending', label: 'Confirmed', icon: Clock },
    { id: 'paid', label: 'Paid', icon: CheckCircle2 },
    { id: 'processing', label: 'Processing', icon: Package },
    { id: 'shipped', label: 'Shipped', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: Home },
  ];

  // Helper to determine step state
  const getStepState = (stepId, currentStatus) => {
    const statusOrder = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepId);

    if (currentStatus === 'cancelled') return 'cancelled';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  if (status === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
        <p className="text-red-700 font-bold text-lg">Order Cancelled</p>
        <p className="text-red-500 text-sm mt-1">This order has been cancelled and is no longer being tracked.</p>
      </div>
    );
  }

  return (
    <div className="w-full py-6">
      <div className="relative flex justify-between">
        {/* Progress Bar Background */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
        
        {/* Active Progress Bar */}
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500 ease-in-out" 
          style={{ 
            width: `${Math.max(0, (steps.findIndex(s => s.id === status) / (steps.length - 1)) * 100)}%` 
          }}
        />

        {steps.map((step, index) => {
          const state = getStepState(step.id, status);
          const Icon = step.icon;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  state === 'completed' ? 'bg-emerald-500 text-white shadow-lg' :
                  state === 'current' ? 'bg-white border-4 border-emerald-500 text-emerald-600 scale-110 shadow-xl' :
                  'bg-white border-2 border-gray-200 text-gray-400'
                }`}
              >
                <Icon size={20} />
              </div>
              <p className={`mt-3 text-xs font-bold whitespace-nowrap ${
                state === 'completed' || state === 'current' ? 'text-gray-900 font-extrabold' : 'text-gray-400'
              }`}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      {status === 'shipped' && trackingNumber && (
        <div className="mt-8 bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-blue-500 p-3 rounded-xl text-white shadow-md">
            <Truck size={24} />
          </div>
          <div className="flex-grow">
            <p className="text-sm font-bold text-blue-900 mb-0.5">In Transit</p>
            <p className="text-xs font-medium text-blue-700">
              Via <span className="font-bold uppercase">{carrierName || 'Global Express'}</span> • Tracking ID: <span className="font-mono bg-blue-100 px-2 py-0.5 rounded text-blue-900 border border-blue-200">{trackingNumber}</span>
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-sm active:scale-95">
            Track Map
          </button>
        </div>
      )}

      {status === 'delivered' && (
        <div className="mt-8 bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 flex items-center gap-4 animate-in zoom-in-95">
          <div className="bg-emerald-500 p-3 rounded-xl text-white shadow-md">
            <Home size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-900 mb-0.5">Delivered Successfully</p>
            <p className="text-xs font-medium text-emerald-700">Pkg was dropped off at your front door.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;

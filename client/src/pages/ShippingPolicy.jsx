import { Truck, Package, RotateCcw } from 'lucide-react';

const ShippingPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 prose prose-lg prose-primary">
      <div className="text-center mb-12">
        <Truck className="mx-auto h-16 w-16 text-primary-600 mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-900">Shipping Policy</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-4"><Package size={24} className="text-primary-500"/> Order Processing</h2>
          <p className="text-gray-600">
            All orders are processed securely within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped, complete with Carrier tracking identification.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Domestic Shipping Rates</h2>
          <p className="text-gray-600 mb-4">We offer nationwide delivery across all states and Union Territories in India.</p>
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="p-3 border-b text-sm font-semibold">Shipping Option</th>
                        <th className="p-3 border-b text-sm font-semibold">Estimated Delivery</th>
                        <th className="p-3 border-b text-sm font-semibold">Price</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="p-3 border-b border-gray-100 text-gray-600">Standard Shipping</td>
                        <td className="p-3 border-b border-gray-100 text-gray-600">4 to 5 business days</td>
                        <td className="p-3 border-b border-gray-100 text-gray-600">₹60 (Free over ₹500)</td>
                    </tr>
                    <tr>
                        <td className="p-3 text-gray-600">Express Priority</td>
                        <td className="p-3 text-gray-600">1 to 2 business days</td>
                        <td className="p-3 text-gray-600">₹150</td>
                    </tr>
                </tbody>
             </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-4"><RotateCcw size={24} className="text-primary-500"/> Returns & Refunds</h2>
          <p className="text-gray-600">
            We accept returns up to 14 days after delivery, if the item is unused and in its original condition, and we will refund the full order amount minus the shipping costs for the return.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ShippingPolicy;

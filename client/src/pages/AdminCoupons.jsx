import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Ticket } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ code: '', discount_percentage: '', expiry_date: '', is_active: true });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/coupons');
      setCoupons(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.put(`/coupons/${editingId}`, formData);
      else await api.post('/coupons', formData);
      setIsModalOpen(false);
      setFormData({ code: '', discount_percentage: '', expiry_date: '', is_active: true });
      setEditingId(null);
      fetchCoupons();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving coupon');
    }
  };

  const editMode = (cpn) => {
    setEditingId(cpn.id);
    setFormData({ 
        code: cpn.code, 
        discount_percentage: cpn.discount_percentage, 
        expiry_date: cpn.expiry_date.split('T')[0], 
        is_active: cpn.is_active 
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete coupon completely?')) {
      try {
        await api.delete(`/coupons/${id}`);
        fetchCoupons();
      } catch (error) {
        alert('Error deleting');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Ticket className="text-primary-600"/> Coupon Generator</h1>
        <button onClick={() => { setEditingId(null); setFormData({code:'',discount_percentage:'',expiry_date:'',is_active:true}); setIsModalOpen(true); }} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700">
           <Plus size={18} /> Generate Code
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-700">Code</th>
                <th className="p-4 font-semibold text-gray-700">Discount</th>
                <th className="p-4 font-semibold text-gray-700">Expiry Date</th>
                <th className="p-4 font-semibold text-gray-700">Status</th>
                <th className="p-4 font-semibold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map(c => {
                  const isExpired = new Date(c.expiry_date) < new Date();
                  return (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-gray-900 font-mono tracking-widest">{c.code}</td>
                  <td className="p-4 font-bold text-green-600">{Number(c.discount_percentage)}% OFF</td>
                  <td className="p-4 text-sm text-gray-600">{new Date(c.expiry_date).toLocaleDateString()}</td>
                  <td className="p-4">
                      {isExpired ? <span className="bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full text-xs font-medium">Expired</span>
                      : !c.is_active ? <span className="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full text-xs font-medium">Disabled</span>
                      : <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-medium">Active</span>}
                  </td>
                  <td className="p-4 flex items-center justify-end gap-3">
                    <button onClick={() => editMode(c)} className="text-blue-600 hover:text-blue-800"><Pencil size={18}/></button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18}/></button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
              <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Coupon' : 'New Coupon'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                   <input required type="text" name="code" value={formData.code} onChange={handleChange} className="w-full p-2 border rounded-md uppercase font-mono" placeholder="SUMMER20" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage (%)</label>
                   <input required type="number" min="1" max="100" name="discount_percentage" value={formData.discount_percentage} onChange={handleChange} className="w-full p-2 border rounded-md" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                   <input required type="date" name="expiry_date" value={formData.expiry_date} onChange={handleChange} className="w-full p-2 border rounded-md" />
                 </div>
                 <div className="flex items-center gap-2 mt-4 border border-gray-200 p-3 rounded bg-gray-50">
                   <input type="checkbox" id="activeToggle" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                   <label htmlFor="activeToggle" className="text-sm font-medium text-gray-800">Coupon is dynamically active</label>
                 </div>
                 <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Save Coupon</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;

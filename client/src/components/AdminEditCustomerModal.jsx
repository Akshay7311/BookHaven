import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import api from '../services/api';

const AdminEditCustomerModal = ({ user, isOpen, onClose, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    isActive: true
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'user',
        isActive: user.isActive !== undefined ? user.isActive : true
      });
      setError('');
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await api.put(`/users/${user.id}`, formData);
      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.response?.data?.message || 'Failed to update user profile. Please check your data.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Edit User Profile</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4">
            
            {/* ID Lock Disclaimer */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Globally Unique Identifier (UUID)</label>
              <input 
                type="text" 
                value={user.id} 
                disabled 
                className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-gray-400 font-mono text-xs cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input 
                type="text" 
                name="name"
                required
                value={formData.name} 
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input 
                type="email" 
                name="email"
                required
                value={formData.email} 
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input 
                type="text" 
                name="phone"
                value={formData.phone} 
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                placeholder="+1 234 567 890"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">System Role</label>
                <select 
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                >
                    <option value="user">Standard User</option>
                    <option value="admin">Administrator</option>
                </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                    <div className="flex items-center h-10">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                name="isActive" 
                                className="sr-only peer" 
                                checked={formData.isActive}
                                onChange={handleChange} 
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            <span className="ml-3 text-sm font-medium text-gray-700">
                                {formData.isActive ? 'Active' : 'Suspended'}
                            </span>
                        </label>
                    </div>
                </div>
            </div>

          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-70"
            >
              {saving ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : <Save size={18} />}
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AdminEditCustomerModal;

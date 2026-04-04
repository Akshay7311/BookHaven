import { useState } from 'react';
import { X, UserPlus, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

const AdminAddCustomerModal = ({ isOpen, onClose, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user'
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
        ...prev, 
        [name]: value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await api.post('/users', formData);
      onSaveSuccess();
      setFormData({ name: '', email: '', phone: '', password: '', role: 'user' });
      onClose();
    } catch (err) {
      console.error("Error creating user:", err);
      setError(err.response?.data?.message || 'Failed to create user. Please check your data.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <UserPlus className="text-primary-600" size={20} />
            <h2 className="text-xl font-bold text-gray-900">Add New User</h2>
          </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all pr-12"
                            placeholder="••••••••"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

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
              {saving ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : <UserPlus size={18} />}
              {saving ? 'Creating...' : 'Create User'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AdminAddCustomerModal;

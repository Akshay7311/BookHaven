import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Save, Camera } from 'lucide-react';
import api from '../services/api';

const ProfileSettings = () => {
  const { user } = useAuth(); // Assume we have updateUser in a robust app
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      
      const { data } = await api.post('/users/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update local storage and context directly by merging existing user data
      const updatedUser = { ...user, avatar: data.avatar };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      alert('Avatar updated successfully! Please reload the page to see changes globally.');
      // A full page reload is a quick fix to sync AuthContext globally if we don't expose a setUser method
      window.location.reload();

    } catch (err) {
       console.error(err);
       alert('Failed to upload avatar.');
    } finally {
       setUploading(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
      
      <div className="max-w-2xl space-y-8">
        {/* Profile Info Form */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Personal Information</h3>
          
          <div className="flex flex-col sm:flex-row gap-8 items-start mb-6">
              {/* Avatar Uploader UI */}
              <div className="relative group cursor-pointer flex-shrink-0" onClick={handleImageClick}>
                  <div className="w-24 h-24 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-3xl uppercase overflow-hidden border-4 border-white shadow-md">
                      {user?.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                          user?.name?.charAt(0) || 'U'
                      )}
                  </div>
                  <div className={`absolute inset-0 bg-black/40 rounded-full flex items-center justify-center transition-opacity ${uploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      {uploading ? <span className="text-white text-xs font-bold">...</span> : <Camera className="text-white" size={24} />}
                  </div>
                  <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                  />
              </div>

              <div className="space-y-4 flex-grow w-full">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" readOnly />
                    <p className="text-xs text-gray-400 mt-1">Contact admin to change your registered name.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" readOnly />
                  </div>
              </div>
          </div>
        </div>

        {/* Password Reset Form Dummy Component for Phase 2 UI completeness */}
        <div>
           <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Change Password</h3>
           <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
            </div>
            <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              <Save size={18} /> Update Password
            </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;

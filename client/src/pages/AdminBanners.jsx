import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Image } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', link_url: '', is_active: true });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/banners');
      setBanners(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('link_url', formData.link_url);
      payload.append('is_active', formData.is_active);
      if (imageFile) payload.append('image', imageFile);

      if (editingId) {
          await api.put(`/banners/${editingId}`, payload, { headers: { 'Content-Type': 'multipart/form-data'}});
      } else {
          await api.post('/banners', payload, { headers: { 'Content-Type': 'multipart/form-data'}});
      }

      setIsModalOpen(false);
      setFormData({ title: '', link_url: '', is_active: true });
      setImageFile(null);
      setEditingId(null);
      fetchBanners();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving banner');
    }
  };

  const editMode = (bn) => {
    setEditingId(bn.id);
    setFormData({ title: bn.title, link_url: bn.link_url || '', is_active: bn.is_active });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete banner graphic?')) {
      try {
        await api.delete(`/banners/${id}`);
        fetchBanners();
      } catch (error) {
        alert('Error deleting');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Image className="text-primary-600"/> Banner Builder</h1>
        <button onClick={() => { setEditingId(null); setFormData({title:'',link_url:'',is_active:true}); setImageFile(null); setIsModalOpen(true); }} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700">
           <Plus size={18} /> Upload Banner
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-700">Preview</th>
                <th className="p-4 font-semibold text-gray-700">Title & Link</th>
                <th className="p-4 font-semibold text-gray-700">Status</th>
                <th className="p-4 font-semibold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {banners.map(b => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="p-4 w-64">
                      <div className="w-full h-24 bg-gray-100 rounded overflow-hidden">
                          <img src={b.image_url} alt="Banner" className="w-full h-full object-cover" />
                      </div>
                  </td>
                  <td className="p-4">
                      <p className="font-bold text-gray-900 mb-1">{b.title}</p>
                      <a href={b.link_url} className="text-sm text-primary-500 hover:underline">{b.link_url || 'No URL mapped'}</a>
                  </td>
                  <td className="p-4">
                      {b.is_active 
                      ? <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-medium">Active</span>
                      : <span className="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full text-xs font-medium">Disabled</span>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-3">
                        <button onClick={() => editMode(b)} className="text-blue-600 hover:text-blue-800"><Pencil size={18}/></button>
                        <button onClick={() => handleDelete(b.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
              <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Banner Settings' : 'New Homepage Banner'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Banner Title (For internal/alt use)</label>
                   <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded-md" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Target Click URL</label>
                   <input type="text" name="link_url" value={formData.link_url} onChange={handleChange} className="w-full p-2 border rounded-md" placeholder="/category/fantasy" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image (Physical Upload)</label>
                   <input type={editingId ? 'file' : 'file'} required={!editingId} onChange={handleFileChange} className="w-full p-2 border rounded-md bg-gray-50" accept="image/*" />
                   {editingId && <p className="text-xs text-gray-500 mt-1">Leave empty to keep existing image</p>}
                 </div>
                 <div className="flex items-center gap-2 mt-4 border border-gray-200 p-3 rounded bg-gray-50">
                   <input type="checkbox" id="activeToggle" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                   <label htmlFor="activeToggle" className="text-sm font-medium text-gray-800">Banner is currently visible to public</label>
                 </div>
                 <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Save Module</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminBanners;

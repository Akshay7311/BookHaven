import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Image, ShieldAlert, Check, ExternalLink } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';

const BANNER_THEMES = [
  { id: 'deep-blue', name: 'Deep', color: 'bg-blue-900', btnColor: 'bg-blue-500 hover:bg-blue-600' },
  { id: 'midnight', name: 'Dark', color: 'bg-slate-900', btnColor: 'bg-primary-500 hover:bg-primary-600' },
  { id: 'forest', name: 'Green', color: 'bg-emerald-900', btnColor: 'bg-emerald-500 hover:bg-emerald-600' },
  { id: 'sunset', name: 'Rose', color: 'bg-rose-900', btnColor: 'bg-rose-500 hover:bg-rose-600' },
  { id: 'amber', name: 'Gold', color: 'bg-amber-900', btnColor: 'bg-amber-600 hover:bg-amber-700' },
  { id: 'charcoal', name: 'Gray', color: 'bg-gray-900', btnColor: 'bg-white text-gray-900 hover:bg-gray-100' },
];

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ 
    title: '', 
    subtitle: '', 
    link_url: '/shop', 
    color: BANNER_THEMES[0].color, 
    btnColor: BANNER_THEMES[0].btnColor,
    is_active: true 
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [bannersRes, catsRes] = await Promise.all([
        api.get('/banners'),
        api.get('/categories')
      ]);
      setBanners(bannersRes.data);
      setCategories(catsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInitialData(); }, []);

  const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const selectTheme = (theme) => {
      setFormData(prev => ({ ...prev, color: theme.color, btnColor: theme.btnColor }));
  };

  const setLinkByTarget = (type, value) => {
    if (type === 'ALL') setFormData(prev => ({ ...prev, link_url: '/shop' }));
    if (type === 'CAT') setFormData(prev => ({ ...prev, link_url: `/shop?category=${value}` }));
    if (type === 'OFFER') setFormData(prev => ({ ...prev, link_url: '/shop?sort=discount' }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return;

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('subtitle', formData.subtitle || '');
      payload.append('link_url', formData.link_url);
      payload.append('color', formData.color);
      payload.append('btnColor', formData.btnColor);
      payload.append('is_active', formData.is_active);
      if (imageFile) payload.append('image', imageFile);

      if (editingId) {
          await api.put(`/banners/${editingId}`, payload, { headers: { 'Content-Type': 'multipart/form-data'}});
      } else {
          await api.post('/banners', payload, { headers: { 'Content-Type': 'multipart/form-data'}});
      }

      setIsModalOpen(false);
      resetForm();
      fetchInitialData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving banner');
    }
  };

  const resetForm = () => {
    setFormData({ 
        title: '', 
        subtitle: '',
        link_url: '/shop', 
        color: BANNER_THEMES[0].color, 
        btnColor: BANNER_THEMES[0].btnColor,
        is_active: true 
    });
    setImageFile(null);
    setEditingId(null);
  };

  const editMode = (bn) => {
    setEditingId(bn.id);
    setFormData({ 
        title: bn.title, 
        subtitle: bn.subtitle || '',
        link_url: bn.link_url || '/shop', 
        color: bn.color || BANNER_THEMES[0].color,
        btnColor: bn.btnColor || BANNER_THEMES[0].btnColor,
        is_active: bn.is_active 
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/banners/${deleteId}`);
      fetchInitialData();
    } catch (error) {
      alert('Error deleting: ' + (error.response?.data?.message || 'Server Error'));
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div>
           <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
             <div className="bg-primary-100 p-1.5 rounded-lg text-primary-600"><Image size={24}/></div>
             Banner Studio
           </h1>
           <p className="text-gray-400 text-xs mt-0.5 ml-10">Manage professionally styled storefront banners.</p>
        </div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="mt-3 sm:mt-0 bg-primary-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-primary-700 shadow-lg shadow-primary-50 transition-all active:scale-95 font-bold text-base">
           <Plus size={20} /> Create New
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map(b => (
            <div key={b.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
              {/* Mini Preview */}
              <div className={`h-40 relative ${b.color}`}>
                 <img src={b.image_url} alt="Preview" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:opacity-80 transition-opacity" />
                 <div className="absolute inset-0 p-4 flex flex-col justify-center text-white">
                    <h4 className="text-base font-black uppercase tracking-tighter truncate">{b.title}</h4>
                    <p className="text-xs opacity-70 mt-1 line-clamp-1">{b.subtitle}</p>
                 </div>
              </div>

              {/* Info Bar */}
              <div className="p-4 flex flex-col gap-3">
                 <div className="flex justify-between items-start">
                    <div className="flex-grow min-w-0">
                       <p className="font-bold text-base text-gray-900 truncate">{b.title}</p>
                       <div className="flex items-center gap-2 mt-1">
                          {b.is_system && <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-black uppercase border border-blue-100">System</span>}
                          {b.is_active 
                            ? <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-black uppercase border border-emerald-100">Live</span>
                            : <span className="bg-gray-50 text-gray-400 px-2 py-0.5 rounded-full text-[10px] font-black uppercase border border-gray-100">Hidden</span>
                          }
                       </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => editMode(b)} className="bg-blue-50 text-blue-600 p-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Pencil size={18}/></button>
                      {!b.is_system && <button onClick={() => handleDelete(b.id)} className="bg-rose-50 text-rose-600 p-2 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={18}/></button>}
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal - Condensed for 1440x900 screens but with Larger Readable Fonts */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 lg:p-6 overflow-y-auto">
           <div className="bg-white rounded-3xl p-6 lg:p-8 w-full max-w-5xl shadow-2xl my-2 lg:my-6 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6 lg:mb-8 border-b border-gray-100 pb-4">
                 <h2 className="text-2xl lg:text-3xl font-black text-gray-900 uppercase tracking-tighter">Banner Studio 2.0</h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 text-3xl font-light transition-colors leading-none hover:rotate-90 duration-200">&times;</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                 {/* Row 1: Titles - FONT SCALED UP */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.15em] mb-2 px-1">1. Headline (Main Title) *</label>
                      <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3.5 outline-none focus:border-primary-500 focus:bg-white transition-all font-bold text-gray-900 text-base" placeholder="e.g. FLASH SALE" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.15em] mb-2 px-1">2. Sub-Headline (Catchy Text)</label>
                      <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3.5 outline-none focus:border-primary-500 focus:bg-white transition-all font-medium text-gray-700 text-base" placeholder="e.g. Up to 50% Off Top Authors" />
                    </div>
                 </div>

                 {/* Row 2: Themes & Linking - PADDING SCALED UP */}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Visual Themes */}
                    <div className="bg-gray-50/50 p-5 rounded-[2rem] border border-gray-100 shadow-sm">
                       <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.15em] mb-4 font-mono px-1">3. Select Appearance Theme</label>
                       <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                          {BANNER_THEMES.map(theme => {
                             const isSelected = formData.color === theme.color;
                             return (
                                <button 
                                   key={theme.id} 
                                   type="button" 
                                   onClick={() => selectTheme(theme)}
                                   className={`group relative h-14 rounded-2xl border-2 transition-all overflow-hidden ${isSelected ? 'border-primary-500 shadow-md scale-105' : 'border-white hover:border-gray-200'}`}
                                   title={theme.name}
                                >
                                   <div className={`absolute inset-0 ${theme.color}`}></div>
                                   {isSelected && (
                                     <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                       <Check size={20} className="text-white drop-shadow-md" />
                                     </div>
                                   )}
                                </button>
                             );
                          })}
                       </div>
                    </div>

                    {/* Linking Helper */}
                    <div className="bg-gray-50/50 p-5 rounded-[2rem] border border-gray-100 flex flex-col justify-between shadow-sm">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.15em] mb-4 font-mono px-1">4. Action Destination</label>
                      <div className="space-y-3">
                         <div className="flex gap-2.5">
                            <button type="button" onClick={() => setLinkByTarget('ALL')} className="flex-1 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black hover:border-primary-500 transition-all uppercase shadow-sm">Shop All</button>
                            <button type="button" onClick={() => setLinkByTarget('OFFER')} className="flex-1 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black hover:border-primary-500 transition-all uppercase shadow-sm">Offers</button>
                            <select 
                               className="flex-[2] bg-white border border-gray-100 rounded-xl px-3 py-2 text-[10px] font-black outline-none focus:border-primary-500 shadow-sm"
                               onChange={(e) => setLinkByTarget('CAT', e.target.value)}
                               defaultValue=""
                            >
                               <option value="" disabled>Link To Category...</option>
                               {categories.map(cat => (
                                 <option key={cat.id} value={cat.name}>{cat.name}</option>
                               ))}
                            </select>
                         </div>
                         <div className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-xs font-mono text-primary-600 truncate flex items-center gap-2 shadow-inner">
                            <ExternalLink size={14} /> {formData.link_url}
                         </div>
                      </div>
                    </div>
                 </div>

                 {/* Row 3: Graphics \u0026 Launch */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-t border-gray-100 pt-6">
                    {/* Image Upload - Larger text */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.15em] mb-3 font-mono px-1">5. Design Asset (Image)</label>
                      <div className="relative group">
                          <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" />
                          <div className="w-full h-20 border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-center gap-3 text-gray-400 group-hover:border-primary-400 group-hover:bg-primary-50/10 transition-all">
                              <Plus size={20} />
                              <span className="text-xs font-black uppercase tracking-widest px-4">{imageFile ? imageFile.name : (editingId ? 'Update Graphics (Optional)' : 'Select Banner Graphic')}</span>
                          </div>
                      </div>
                    </div>

                    {/* Final Action Bar */}
                    <div className="flex flex-col gap-4">
                       <div className="flex items-center gap-3 px-1">
                          <input type="checkbox" id="activeToggle" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-5 h-5 text-primary-600 border-gray-300 rounded-lg shadow-sm focus:ring-primary-500" />
                          <label htmlFor="activeToggle" className="text-xs font-black text-gray-700 uppercase tracking-[0.1em] cursor-pointer">Live On Storefront</label>
                       </div>
                       <div className="flex gap-3">
                         <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-gray-400 font-black uppercase text-xs transition-all hover:bg-gray-50 rounded-2xl active:scale-95">Discard</button>
                         <button type="submit" className="flex-1 py-4 bg-primary-600 text-white font-black uppercase text-xs rounded-2xl hover:bg-primary-700 shadow-xl shadow-primary-100 transition-all active:scale-95">Launch Banner</button>
                       </div>
                    </div>
                 </div>
              </form>
           </div>
        </div>
      )}

      <ConfirmModal 
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Permanently Remove Banner"
          message="Are you sure you want to delete this banner? It will be removed from the store immediately."
          confirmText="Delete Banner"
       />
    </div>
  );
};

export default AdminBanners;

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import api from '../services/api';

const AdminEditBookModal = ({ book, isOpen, onClose, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    categoryId: '',
    stock: ''
  });
  const [coverFile, setCoverFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [coverPreview, setCoverPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    if (isOpen) fetchCategories();
  }, [isOpen]);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        description: book.description || '',
        price: book.price || '',
        categoryId: book.categoryId || '',
        stock: book.stock || 0
      });
      setCoverFile(null);
      setGalleryFiles([]);
      setCoverPreview(book.coverImageUrl || null);
      setGalleryPreviews([]);
      if(document.getElementById('editCoverImageInput')) document.getElementById('editCoverImageInput').value = '';
      if(document.getElementById('editGalleryImagesInput')) document.getElementById('editGalleryImagesInput').value = '';
    }
  }, [book]);

  if (!isOpen || !book) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      alert('You can only add up to 4 gallery images');
      e.target.value = '';
      return;
    }
    setGalleryFiles(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setGalleryPreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
      
      if (coverFile) {
        submitData.append('coverImage', coverFile);
      }
      
      if (galleryFiles.length > 0) {
        galleryFiles.forEach(file => {
          submitData.append('images', file);
        });
      }

      await api.put(`/books/${book.id}`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSaveSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.errors || err.response?.data?.message || 'Failed to update book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Edit Book ID: {book.id}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg mb-6 shadow-sm">
               <div className="flex items-center gap-2 font-bold mb-1">
                  <span className="bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">!</span>
                  Validation Error
               </div>
               {Array.isArray(error) ? (
                  <ul className="list-disc list-inside text-sm space-y-0.5 ml-1">
                     {error.map((err, i) => (
                        <li key={i}>{typeof err === 'object' ? err.message : err}</li>
                     ))}
                  </ul>
               ) : (
                  <p className="text-sm ml-7">{error}</p>
               )}
            </div>
          )}

          <form id="editBookForm" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Author</label>
                <input required type="text" name="author" value={formData.author} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"/>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
                <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                <select 
                  name="categoryId" 
                  required 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                  value={formData.categoryId} 
                  onChange={handleChange}
                >
                  <option value="">{categories.length === 0 ? 'Loading Categories...' : 'Select Category'}</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Amount</label>
                <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Cover Image Section */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                  Book Cover
                </label>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group w-32 h-44 bg-white rounded-lg shadow-inner border border-gray-100 flex items-center justify-center overflow-hidden">
                    {coverPreview ? (
                      <>
                        <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute top-2 left-2 bg-primary-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                          {coverFile ? 'NEW' : 'CURRENT'}
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-400 text-xs text-center px-4">No cover available</span>
                    )}
                  </div>
                  <div className="w-full">
                    <input 
                      type="file" 
                      id="editCoverImageInput"
                      accept="image/*" 
                      onChange={handleCoverChange} 
                      className="block w-full text-[11px] text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[11px] file:font-bold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Gallery Section */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  Gallery (Max 4 New)
                </label>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2 min-h-[100px] content-start">
                    {/* Current Gallery */}
                    {book.images && book.images.map((img, idx) => (
                      <div key={img.id} className="w-14 h-20 bg-white border border-gray-100 rounded shadow-sm overflow-hidden flex-shrink-0">
                        <img src={img.imageUrl} alt={`gallery-${idx}`} className="w-full h-full object-cover grayscale-[0.3]" title="Current image" />
                      </div>
                    ))}
                    {/* New Previews */}
                    {galleryPreviews.map((preview, idx) => (
                      <div key={idx} className="w-14 h-20 bg-white border-2 border-primary-400 rounded shadow-sm overflow-hidden flex-shrink-0 relative">
                        <img src={preview} alt={`new-${idx}`} className="w-full h-full object-cover" />
                        <span className="absolute top-0 right-0 bg-primary-500 text-white text-[7px] px-1 rounded-bl font-bold">NEW</span>
                      </div>
                    ))}
                    {/* Empty slots placeholders */}
                    {[...Array(Math.max(0, 4 - galleryPreviews.length))].map((_, i) => (
                      <div key={'blank'+i} className="w-14 h-20 bg-gray-100/50 border border-dashed border-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                        <span className="text-[9px] text-gray-300">Slot</span>
                      </div>
                    ))}
                  </div>
                  <div className="w-full">
                    <input 
                      type="file" 
                      id="editGalleryImagesInput"
                      multiple 
                      accept="image/*" 
                      onChange={handleGalleryChange} 
                      className="block w-full text-[11px] text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[11px] file:font-bold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Book Description</label>
              <textarea name="description" rows="4" value={formData.description} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm resize-none bg-gray-50/30"></textarea>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" form="editBookForm" disabled={loading} className="px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-70">
            <Save size={16} />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEditBookModal;

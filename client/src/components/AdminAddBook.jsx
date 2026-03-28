import { useState, useEffect } from 'react';
import api from '../services/api';

const AdminAddBook = ({ onBookAdded }) => {
  const [formData, setFormData] = useState({
    title: '', author: '', description: '', price: '', categoryId: '', stock: ''
  });
  const [coverFile, setCoverFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [coverPreview, setCoverPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Changed to null/object for complexity

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    
    if (!coverFile && !formData.image_url) {
      setError('Please select a book cover');
      setLoading(false);
      return;
    }
    
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('author', formData.author);
      submitData.append('description', formData.description);
      submitData.append('price', Number(formData.price));
      submitData.append('stock', Number(formData.stock));
      if (formData.categoryId) {
        submitData.append('categoryId', formData.categoryId);
      }
      if (coverFile) {
        submitData.append('coverImage', coverFile);
      }
      
      if (galleryFiles.length > 0) {
        galleryFiles.forEach(file => {
          submitData.append('images', file);
        });
      }

      await api.post('/books', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert('Book added successfully');
      setFormData({ title: '', author: '', description: '', price: '', categoryId: '', stock: '' });
      setCoverFile(null);
      setGalleryFiles([]);
      setCoverPreview(null);
      setGalleryPreviews([]);
      // reset file inputs visually
      if (document.getElementById('coverImageInput')) document.getElementById('coverImageInput').value = '';
      if (document.getElementById('galleryImagesInput')) document.getElementById('galleryImagesInput').value = '';
      
      if (onBookAdded) onBookAdded();
    } catch (err) {
      setError(err.response?.data?.errors || err.response?.data?.message || 'Error adding book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Book</h2>
      {console.log('Current error state:', error)}
      
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg mb-6 shadow-sm">
           <div className="flex items-center gap-2 font-bold mb-1">
              <span className="bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">!</span>
              Validation Error
           </div>
           {Array.isArray(error) ? (
              <ul className="list-disc list-inside text-sm space-y-0.5 ml-1">
                 {error.map((err, i) => (
                    <li key={i}>{typeof err === 'object' ? (err.message || 'Validation error') : err}</li>
                 ))}
              </ul>
           ) : (
              <p className="text-sm ml-7">
                {typeof error === 'string' && error.startsWith('[') 
                  ? JSON.parse(error).map(e => e.message).join(', ') 
                  : error}
              </p>
           )}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input type="text" name="title" required className="input-field" value={formData.title} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
          <input type="text" name="author" required className="input-field" value={formData.author} onChange={handleChange} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" rows="3" className="input-field" value={formData.description} onChange={handleChange}></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
          <input type="number" step="0.01" name="price" required className="input-field" value={formData.price} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock Amount</label>
          <input type="number" name="stock" required className="input-field" value={formData.stock} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select 
            name="categoryId" 
            required 
            className="input-field" 
            value={formData.categoryId} 
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cover Image Upload */}
            <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
               <label className="block text-sm font-bold text-gray-700 mb-2">Book Cover (Required)</label>
               <div className="flex items-start gap-4">
                  <div className="w-32 h-44 bg-white border rounded shadow-sm flex-shrink-0 flex items-center justify-center overflow-hidden">
                     {coverPreview ? (
                        <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                     ) : (
                        <span className="text-gray-400 text-xs text-center px-2">No cover selected</span>
                     )}
                  </div>
                  <div className="flex-grow">
                     <input 
                        type="file" 
                        id="coverImageInput"
                        accept="image/*" 
                        onChange={handleCoverChange} 
                        className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                     />
                     <p className="text-[10px] text-gray-400 mt-2">Recommended size: 400x600px. JPG, PNG supported.</p>
                  </div>
               </div>
            </div>

            {/* Gallery Images Upload */}
            <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
               <label className="block text-sm font-bold text-gray-700 mb-2">Gallery Images (Max 4)</label>
               <input 
                  type="file" 
                  id="galleryImagesInput"
                  multiple 
                  accept="image/*" 
                  onChange={handleGalleryChange} 
                  className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
               />
               <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                  {galleryPreviews.map((preview, i) => (
                     <div key={i} className="w-16 h-20 bg-white border rounded shadow-sm flex-shrink-0 overflow-hidden">
                        <img src={preview} alt="Gallery Preview" className="w-full h-full object-cover" />
                     </div>
                  ))}
                  {[...Array(Math.max(0, 4 - galleryPreviews.length))].map((_, i) => (
                    <div key={'blank'+i} className="w-16 h-20 bg-gray-100 border border-gray-200 border-dashed rounded flex-shrink-0 flex items-center justify-center">
                        <span className="text-[10px] text-gray-300">Add</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Adding...' : 'Add Book'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddBook;

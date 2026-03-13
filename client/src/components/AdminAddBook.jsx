import { useState } from 'react';
import api from '../services/api';

const AdminAddBook = ({ onBookAdded }) => {
  const [formData, setFormData] = useState({
    title: '', author: '', description: '', price: '', category: '', stock: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('author', formData.author);
      submitData.append('description', formData.description);
      submitData.append('price', Number(formData.price));
      submitData.append('stock', Number(formData.stock));
      submitData.append('category', formData.category);
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      await api.post('/books', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert('Book added successfully');
      setFormData({ title: '', author: '', description: '', price: '', category: '', stock: '' });
      setImageFile(null);
      // reset file input visually
      document.getElementById('addBookImageInput').value = '';
      
      if (onBookAdded) onBookAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Book</h2>
      
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}
      
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
          <input type="text" name="category" className="input-field" value={formData.category} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Book Cover File</label>
          <input 
            id="addBookImageInput"
            type="file" 
            accept="image/*"
            name="image" 
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 border border-gray-300 rounded-lg p-1.5 focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-white" 
            onChange={handleFileChange} 
          />
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

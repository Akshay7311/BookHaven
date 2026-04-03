import { useState, useEffect } from 'react';
import { Pencil, Trash2, BookOpen } from 'lucide-react';
import api from '../services/api';
import AdminAddBook from '../components/AdminAddBook';
import AdminEditBookModal from '../components/AdminEditBookModal';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: bData } = await api.get('/books?limit=200');
      setBooks(bData.books || []);
    } catch (error) {
      console.error('Error fetching admin data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteBook = async (bookId) => {
    setBookToDelete(bookId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
     if (!bookToDelete) return;
     try {
       await api.delete(`/books/${bookToDelete}`);
       fetchData();
     } catch (error) {
       alert('Failed to delete book');
     }
  };

  const handleEditClick = (book) => {
    setEditingBook(book);
    setIsEditModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Product Catalog Management</h1>
      </div>

      <AdminAddBook onBookAdded={fetchData} />
      <AdminEditBookModal 
          book={editingBook} 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          onSaveSuccess={fetchData} 
      />
      <ConfirmModal 
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Book"
          message="Are you sure you want to delete this book? This action cannot be undone."
          confirmText="Delete Book"
      />
      {loading ? <LoadingSpinner /> : (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 font-semibold text-gray-700 text-sm">ID</th>
                        <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Cover</th>
                        <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Title</th>
                        <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Author</th>
                        <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Price (₹)</th>
                        <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Stock</th>
                        <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {books.map(book => (
                        <tr key={book.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-xs font-mono text-gray-400" title={book.id}>{book.id.substring(0,8)}...</td>
                        <td className="px-6 py-2">
                            <div className="w-10 h-14 bg-gray-100 rounded overflow-hidden">
                            {book.image_url ? 
                                <img src={book.image_url} alt="" className="w-full h-full object-cover" /> : 
                                <div className="w-full h-full text-[10px] flex items-center justify-center text-gray-400">No Img</div>
                            }
                            </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">{book.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{book.author}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">₹ {Number(book.price).toFixed(2)}</td>
                        <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${book.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {book.stock}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-4">
                            <button 
                                onClick={() => handleEditClick(book)} 
                                className="text-primary-600 hover:text-primary-800 transition-colors p-1"
                                title="Edit Book"
                            >
                                <Pencil size={18} />
                            </button>
                            <button 
                                onClick={() => handleDeleteBook(book.id)} 
                                className="text-red-500 hover:text-red-700 transition-colors p-1"
                                title="Delete Book"
                            >
                                <Trash2 size={18} />
                            </button>
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
          {books.length === 0 && <div className="p-8 text-center text-gray-500">No books found in database.</div>}
          </div>
      </div>
      )}

    </div>
  );
};

export default AdminDashboard;

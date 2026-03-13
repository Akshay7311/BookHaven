import { useState, useEffect } from 'react';
import { MailOpen, Trash2, Mail } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/contact');
      setMessages(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const markAsRead = async (id) => {
     try {
         await api.put(`/contact/${id}/read`);
         fetchMessages();
     } catch (error) {
         alert('Failed to mark as read');
     }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete message completely?')) {
      try {
        await api.delete(`/contact/${id}`);
        fetchMessages();
      } catch (error) {
        alert('Error deleting');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="text-primary-600"/> Messages Inbox
        </h1>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-700 w-1/4">Sender Details</th>
                <th className="p-4 font-semibold text-gray-700 w-1/2">Subject & Message</th>
                <th className="p-4 font-semibold text-gray-700">Date Received</th>
                <th className="p-4 font-semibold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {messages.map(m => (
                <tr key={m.id} className={`hover:bg-gray-50 transition-colors ${!m.is_read ? 'bg-primary-50/30' : ''}`}>
                  <td className="p-4">
                      <p className="font-bold text-gray-900 mb-1">{m.name}</p>
                      <a href={`mailto:${m.email}`} className="text-sm text-primary-600 hover:underline">{m.email}</a>
                  </td>
                  <td className="p-4">
                      <p className="font-bold text-gray-900 mb-2">{m.subject}</p>
                      <p className="text-sm text-gray-600 leading-relaxed max-w-xl whitespace-pre-wrap">{m.message}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                      {new Date(m.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-3">
                        {!m.is_read && (
                            <button onClick={() => markAsRead(m.id)} className="text-green-600 hover:text-green-800 flex items-center gap-1 text-sm font-medium border border-green-200 bg-green-50 px-2 py-1 rounded">
                                <MailOpen size={16}/> Read
                            </button>
                        )}
                        <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:text-red-800 bg-red-50 p-1.5 rounded"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {messages.length === 0 && (
                  <tr>
                      <td colSpan="4" className="p-12 text-center text-gray-500">Inbox is empty.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;

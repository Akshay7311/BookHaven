import { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Trash2, Pencil } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import AdminEditCustomerModal from './AdminEditCustomerModal';

const AdminCustomerList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users');
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('WARNING: Deleting a user will gracefully remove their access. Confirm?')) {
      try {
        await api.delete(`/users/${userId}`);
        fetchUsers();
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
      
      <AdminEditCustomerModal 
        user={editingUser} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onSaveSuccess={fetchUsers} 
      />

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm">User ID</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Name</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Email</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Role</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Joined</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-xs font-mono text-gray-400">{user.id}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {user.role === 'admin' ? <ShieldAlert size={12}/> : <Shield size={12}/>}
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-4">
                    <button 
                      onClick={() => handleEditClick(user)} 
                      className="text-primary-600 hover:text-primary-800 transition-colors p-1"
                      title="Edit User"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)} 
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <div className="p-8 text-center text-gray-500">No users found.</div>}
      </div>
    </div>
  );
};

export default AdminCustomerList;

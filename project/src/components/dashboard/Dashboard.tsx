import React, { useState } from 'react';
import { Plus, Search, Copy, Eye, EyeOff, Trash } from 'lucide-react';
import { usePasswords } from '../../hooks/usePasswords';
import { StoredPassword } from '../../types';
import { useAuth0 } from '@auth0/auth0-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth0();
  const { passwords, loading, error, addPassword, deletePassword } = usePasswords();
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPassword, setNewPassword] = useState({
    title: '',
    username: '',
    password: '',
    url: '',
    notes: '',
  });

  const handleAddPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPassword({
        ...newPassword,
        user_id: user?.sub || '',
      }, 'your-master-key'); // In production, this should be securely managed
      setShowAddModal(false);
      setNewPassword({ title: '', username: '', password: '', url: '', notes: '' });
    } catch (error) {
      console.error('Failed to add password:', error);
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPassword((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Password Vault</h1>
          <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Password
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
              type="text"
              placeholder="Search passwords..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {passwords.map((password) => (
                <li key={password.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                            className="h-10 w-10 rounded"
                            src={`https://www.google.com/s2/favicons?domain=${password.url}&sz=64`}
                            alt={password.title}
                        />
                      </div>
                      <div className="ml-4">
                        <h2 className="text-sm font-medium text-gray-900">{password.title}</h2>
                        <p className="text-sm text-gray-500">{password.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                          onClick={() => copyToClipboard(password.username)}
                          className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                      <button
                          onClick={() => togglePasswordVisibility(password.id)}
                          className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                      >
                        {showPassword[password.id] ? (
                            <EyeOff className="h-5 w-5" />
                        ) : (
                            <Eye className="h-5 w-5" />
                        )}
                      </button>
                      <button
                          onClick={() => deletePassword(password.id)}
                          className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
            ))}
          </ul>
        </div>

        {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-xl font-semibold mb-4">Add New Password</h2>
                <form onSubmit={handleAddPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        value={newPassword.title}
                        onChange={(e) => setNewPassword({ ...newPassword, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        value={newPassword.username}
                        onChange={(e) => setNewPassword({ ...newPassword, username: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        value={newPassword.password}
                        onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">URL</label>
                    <input
                        type="url"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        value={newPassword.url}
                        onChange={(e) => setNewPassword({ ...newPassword, url: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        value={newPassword.notes}
                        onChange={(e) => setNewPassword({ ...newPassword, notes: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  );
};

export default Dashboard;
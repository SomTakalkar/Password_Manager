import React, { useState } from 'react';
import { Plus, Search, Copy, Eye, EyeOff, Trash, ExternalLink, Globe, User, Key, Shield } from 'lucide-react';
import { usePasswords } from '../../hooks/usePasswords';
import { passwordService } from '../../services/passwordService';

interface DashboardProps {
  masterKey: string;
}

const Dashboard: React.FC<DashboardProps> = ({ masterKey }) => {
  const { passwords, loading, error, addPassword, deletePassword } = usePasswords(masterKey);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [decryptedPasswords, setDecryptedPasswords] = useState<Record<string, string>>({});
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
      }, masterKey);

      setShowAddModal(false);
      setNewPassword({ title: '', username: '', password: '', url: '', notes: '' });
    } catch (error) {
      console.error('Failed to add password:', error);
    }
  };

  const togglePasswordVisibility = async (id: string, encrypted: string) => {
    if (showPassword[id]) {
      setShowPassword(prev => ({ ...prev, [id]: false }));
      return;
    }

    if (decryptedPasswords[id]) {
      setShowPassword(prev => ({ ...prev, [id]: true }));
      return;
    }

    try {
      const decrypted = await passwordService.decryptPassword(encrypted, masterKey);
      setDecryptedPasswords(prev => ({ ...prev, [id]: decrypted }));
      setShowPassword(prev => ({ ...prev, [id]: true }));
    } catch (e) {
      console.error("Decryption failed", e);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const copyDecryptedPassword = async (id: string, encrypted: string) => {
    try {
      let text = decryptedPasswords[id];
      if (!text) {
        text = await passwordService.decryptPassword(encrypted, masterKey);
        setDecryptedPasswords(prev => ({ ...prev, [id]: text }));
      }
      await copyToClipboard(text);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  const filteredPasswords = passwords.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-emerald-500 text-lg animate-pulse">Loading vault...</div>
    </div>
  );

  if (error) return (
    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
      Error: {error.message}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Password Vault</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Manage and secure your credentials</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="group inline-flex items-center px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
          Add Password
        </button>
      </div>

      {/* Search */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search your vault..."
          className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900/50 backdrop-blur border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid List */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredPasswords.map((password) => (
          <div
            key={password.id}
            className="group relative bg-white dark:bg-slate-900/50 backdrop-blur border border-gray-200 dark:border-white/5 rounded-2xl p-5 hover:border-emerald-500/30 dark:hover:bg-white/5 dark:hover:border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center p-2">
                  <img
                    className="w-full h-full object-contain rounded-sm opacity-70 group-hover:opacity-100 transition-opacity"
                    src={`https://www.google.com/s2/favicons?domain=${password.url}&sz=64`}
                    alt=""
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,...'; // Fallback or hide
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <Globe className="w-5 h-5 text-gray-400 dark:text-slate-500 absolute" style={{ zIndex: -1 }} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors truncate max-w-[150px]">
                    {password.title}
                  </h3>
                  <a
                    href={password.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 dark:text-slate-500 hover:text-emerald-500 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors"
                  >
                    {password.url ? new URL(password.url).hostname : 'No URL'} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <button
                  onClick={() => deletePassword(password.id)}
                  className="p-2 rounded-lg text-gray-400 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 transition-colors"
                  title="Delete"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-slate-950/50 rounded-lg p-2.5 flex items-center justify-between border border-gray-100 dark:border-black/20 group-hover:border-gray-200 dark:group-hover:border-white/5 transition-colors">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <User className="w-4 h-4 text-gray-400 dark:text-slate-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-slate-300 truncate">{password.username}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(password.username)}
                  className="p-1.5 rounded text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                  title="Copy Username"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-slate-950/50 rounded-lg p-2.5 flex items-center justify-between border border-gray-100 dark:border-black/20 group-hover:border-gray-200 dark:group-hover:border-white/5 transition-colors">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <Key className="w-4 h-4 text-gray-400 dark:text-slate-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-slate-300 font-mono truncate">
                    {showPassword[password.id] ? (decryptedPasswords[password.id] || '...') : '••••••••••••'}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => togglePasswordVisibility(password.id, password.encrypted_password)}
                    className="p-1.5 rounded text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                    title={showPassword[password.id] ? "Hide Password" : "Show Password"}
                  >
                    {showPassword[password.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => copyDecryptedPassword(password.id, password.encrypted_password)}
                    className="p-1.5 rounded text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                    title="Copy Password"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPasswords.length === 0 && (
        <div className="text-center py-20 text-gray-400 dark:text-slate-500">
          <Shield className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg">No passwords found</p>
          <p className="text-sm">Add a new password to get started</p>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Add New Credential</h2>
            <form onSubmit={handleAddPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Netflix"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  value={newPassword.title}
                  onChange={(e) => setNewPassword({ ...newPassword, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-400 mb-1">Username / Email</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  value={newPassword.username}
                  onChange={(e) => setNewPassword({ ...newPassword, username: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-400 mb-1">Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  value={newPassword.password}
                  onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-400 mb-1">URL</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 dark:text-slate-500" />
                  <input
                    type="url"
                    placeholder="https://..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    value={newPassword.url}
                    onChange={(e) => setNewPassword({ ...newPassword, url: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-400 mb-1">Notes</label>
                <textarea
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[80px]"
                  value={newPassword.notes}
                  onChange={(e) => setNewPassword({ ...newPassword, notes: e.target.value })}
                />
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-colors"
                >
                  Save Credential
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

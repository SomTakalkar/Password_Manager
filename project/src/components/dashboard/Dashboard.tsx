import React from 'react';
import { Plus, Search, Copy, Eye, EyeOff, Trash } from 'lucide-react';
import { StoredPassword } from '../../types';

const Dashboard: React.FC = () => {
  const [passwords, setPasswords] = React.useState<StoredPassword[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showPassword, setShowPassword] = React.useState<Record<string, boolean>>({});

  // TODO: Implement actual password fetching
  React.useEffect(() => {
    // Mock data
    setPasswords([
      {
        id: '1',
        title: 'Gmail',
        username: 'user@example.com',
        password: 'encrypted-password',
        url: 'https://gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  }, []);

  const togglePasswordVisibility = (id: string) => {
    setShowPassword((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // TODO: Show success toast
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Password Vault</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
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
                    onClick={() => {/* TODO: Implement delete */}}
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
    </div>
  );
};

export default Dashboard;
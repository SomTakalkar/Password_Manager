import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Settings, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface LayoutProps {
    children: React.ReactNode;
    setTheme: (theme: 'light' | 'dark') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, setTheme }) => {

    
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Shield className="h-8 w-8 text-emerald-500" />
                  <span className="ml-2 text-xl font-bold text-gray-900">Secure Vault</span>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                      to="/dashboard"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          location.pathname === '/dashboard'
                              ? 'border-emerald-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                      to="/generator"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          location.pathname === '/generator'
                              ? 'border-emerald-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    Password Generator
                  </Link>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <Settings className="h-6 w-6" />
                </button>
                <button
                    onClick={handleLogout}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {showSettings && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-xl font-semibold mb-4">Settings</h2>
                {/* Add your settings options here */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Dark Mode</span>
                     <button
                                    onClick={() => setTheme((currentTheme) =>
                                        currentTheme === 'light' ? 'dark' : 'light'
                                    )}
                                    className="px-4 py-2 bg-gray-200 rounded-md"
                                >Toggle Dark Mode</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Auto-logout Timer</span>
                    <select className="border rounded-md px-2 py-1">
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option>1 hour</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                      onClick={() => setShowSettings(false)}
                      className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
        )}

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
  );
};

export default Layout;
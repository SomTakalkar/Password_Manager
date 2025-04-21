import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import { auth } from './lib/firebase';
import PasswordGenerator from './components/tools/PasswordGenerator';
import Layout from './components/layout/Layout';
import { useTheme } from './hooks/useTheme';
import { useInactivityTimer } from './hooks/useInactivityTimer';

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { theme, setTheme } = useTheme(); // Destructure setTheme from useTheme

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  useInactivityTimer(INACTIVITY_TIMEOUT, () => {
    if (isAuthenticated) {
      signOut(auth).catch((error) => {
        console.error('Logout error:', error);
      });
    }
  });

  if(isAuthenticated === null){
    return null
  }

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-900 to-gray-800'} flex items-center justify-center p-4`}>
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-primary-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Secure Vault</h1>
            <p className="text-gray-400">Your trusted password manager</p>
          </div>
          <Login />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout setTheme={setTheme}> {/* Pass setTheme to Layout */}
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/generator" element={<PasswordGenerator />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

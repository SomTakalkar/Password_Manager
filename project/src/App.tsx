import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import PasswordGenerator from './components/tools/PasswordGenerator';
import Layout from './components/layout/Layout';
import { useTheme } from './hooks/useTheme';
import { useInactivityTimer } from './hooks/useInactivityTimer';

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes

function App() {
  const { theme } = useTheme();
  const { isAuthenticated, logout } = useAuth0();

  useInactivityTimer(INACTIVITY_TIMEOUT, () => {
    if (isAuthenticated) {
      logout({ logoutParams: { returnTo: window.location.origin } });
    }
  });

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
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/generator" element={<PasswordGenerator />} />
        </Routes>
      </Layout>
    </Router>
  );
}

function AuthWrappedApp() {
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN || ''}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID || ''}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <App />
    </Auth0Provider>
  );
}

export default AuthWrappedApp;
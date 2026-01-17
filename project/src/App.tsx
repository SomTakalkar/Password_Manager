import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MasterPasswordLogin from './components/auth/MasterPasswordLogin';
import SetupVault from './components/auth/SetupVault';
import RecoveryMode from './components/auth/RecoveryMode';
import Dashboard from './components/dashboard/Dashboard';
import PasswordGenerator from './components/tools/PasswordGenerator';
import Layout from './components/layout/Layout';
import { useInactivityTimer } from './hooks/useInactivityTimer';
import { passwordService } from './services/passwordService';
import { ThemeProvider } from './context/ThemeContext';

export const AuthContext = React.createContext<{
  logout: () => void;
}>({ logout: () => { } });

type AuthState = 'loading' | 'setup' | 'login' | 'recovery' | 'authenticated';

function App() {
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [masterKey, setMasterKey] = useState<string | null>(null);

  useEffect(() => {
    // Check if vault exists
    const init = passwordService.isVaultInitialized();
    setAuthState(init ? 'login' : 'setup');
  }, []);

  const handleLogin = async (key: string) => {
    try {
      const dek = await passwordService.unlockVault(key);
      setMasterKey(dek);
      setAuthState('authenticated');
    } catch (e) {
      console.error("Unlock failed", e);
      throw e; // Login component catches this
    }
  };

  const handleSetupComplete = (password: string) => {
    passwordService.unlockVault(password).then(dek => {
      setMasterKey(dek);
      setAuthState('authenticated');
    });
  };

  const handleRecoveryComplete = (newPassword: string) => {
    passwordService.unlockVault(newPassword).then(dek => {
      setMasterKey(dek);
      setAuthState('authenticated');
    });
  };

  const logout = () => {
    setMasterKey(null);
    setAuthState('login');
  };

  useInactivityTimer(15 * 60 * 1000, () => {
    if (authState === 'authenticated') {
      logout();
    }
  });

  if (authState === 'loading') return null;

  if (authState === 'setup') {
    return <SetupVault onSetupComplete={handleSetupComplete} />;
  }

  if (authState === 'recovery') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <RecoveryMode
          onRecoveryComplete={handleRecoveryComplete}
          onCancel={() => setAuthState('login')}
        />
      </div>
    );
  }

  if (authState === 'login') {
    return (
      <MasterPasswordLogin
        onLogin={handleLogin}
        onForgotPassword={() => setAuthState('recovery')}
      />
    );
  }

  return (
    <ThemeProvider>
      <AuthContext.Provider value={{ logout }}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard masterKey={masterKey!} />} />
              <Route path="/generator" element={<PasswordGenerator />} />
            </Routes>
          </Layout>
        </Router>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
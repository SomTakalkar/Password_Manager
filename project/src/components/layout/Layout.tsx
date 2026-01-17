import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Key, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { AuthContext } from '../../App';
import { useTheme } from '../../context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/generator', icon: Key, label: 'Generator' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex transition-all duration-300">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white dark:bg-slate-800 rounded-lg text-gray-900 dark:text-white shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 
        bg-white dark:bg-slate-900/50 backdrop-blur-xl border-r border-gray-200 dark:border-white/5 
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center space-x-3 border-b border-gray-100 dark:border-white/5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-gradient-to-br dark:from-emerald-500/20 dark:to-blue-500/20 flex items-center justify-center border border-emerald-500/20 dark:border-emerald-500/30">
            <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-white dark:to-slate-400">
            Secure Vault
          </span>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive(item.path)
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                  : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 dark:border-white/5 space-y-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-gray-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full relative overflow-x-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-500/5 dark:from-emerald-900/10 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto p-4 lg:p-8 relative z-10">
          {children}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;

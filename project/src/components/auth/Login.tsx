import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Github, Mail, Microscope as Microsoft } from 'lucide-react';

const Login: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = (connection?: string) => {
    loginWithRedirect({
      authorizationParams: {
        connection,
        redirect_uri: window.location.origin,
      },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 space-y-4">
      <div className="space-y-2">
        <button
          onClick={() => handleLogin('google-oauth2')}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="h-5 w-5 mr-2" />
          Continue with Google
        </button>

        <button
          onClick={() => handleLogin('github')}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <Github className="h-5 w-5 mr-2" />
          Continue with GitHub
        </button>

        <button
          onClick={() => handleLogin('microsoft')}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <Microsoft className="h-5 w-5 mr-2" />
          Continue with Microsoft
        </button>

        <button
          onClick={() => handleLogin()}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <Mail className="h-5 w-5 mr-2" />
          Continue with Email
        </button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;
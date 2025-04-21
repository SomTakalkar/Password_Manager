import React, { useState, useEffect } from 'react';
import {
  Github,
  Mail,
} from 'lucide-react'; // Microsoft icon not directly available, consider alternatives
import { GoogleAuthProvider, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, signInWithPopup } from 'firebase/auth';


import { auth } from '../../lib/firebase'; // Assuming Firebase init is in ../../lib/firebase


const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const actionCodeSettings = {
    url: window.location.href,
    handleCodeInApp: true
  };
  



  const handleLogin = async (provider: string) => {
    setError(null);
    try {
      let authProvider;
      switch (provider) {
        case 'google':
          authProvider = new GoogleAuthProvider();
          break;
        //  EmailAuthProvider requires more setup (see notes below)
        //  case 'email':
        //    authProvider = new EmailAuthProvider();
        //    break;
        default:
          throw new Error('Invalid provider');
      }

      if (authProvider) {
        await signInWithPopup(auth, authProvider);
        // Successful login - you might want to redirect here
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    }
  };

  const handleEmailLogin = async () => {
    try {
        setError(null);
        setMessage(null);
        localStorage.setItem('emailForSignIn', email);
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        setMessage('Check your email for a sign-in link!');
        setEmail('');
    } catch (error) {
        console.error('Email login error:', error);
        setError('Failed to send sign-in link. Please try again.');
    }
};

  useEffect(() => {
      const completeEmailLinkSignIn = async () => {
          if (isSignInWithEmailLink(auth, window.location.href)) {
              try {
                  const emailFromStorage = localStorage.getItem('emailForSignIn');
                  if (!emailFromStorage) throw new Error('Email not found');
                  await signInWithEmailLink(auth, emailFromStorage, window.location.href);
                  setMessage('Successfully signed in with email!');
                  localStorage.removeItem('emailForSignIn');
              } catch (error) {
                  console.error('Email sign-in error:', error);
                  setError('Failed to sign in with email link.');
              }
          }
      };
      completeEmailLinkSignIn();
  }, []);


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 space-y-4">
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <div className="space-y-2">
        <button
          onClick={() => handleLogin('google')}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="h-5 w-5 mr-2"
          />
          Continue with Google
        </button>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700'
        />
        <button onClick={handleEmailLogin} className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" >Continue with Email</button>
        {message && <div className="text-green-500 text-sm">{message}</div>}

        {/* Microsoft - requires EmailAuthProvider or additional setup */}
        {/*  For EmailAuthProvider, you'd typically trigger a flow to send a sign-in link to the user's email */}
        {/*  Since it requires more UI and backend logic, I'm commenting it out for now */}
        {/*  <button */}
        {/*    onClick={() => handleLogin('email')}  //  Or handle Microsoft separately if using a different method */}
        {/*    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" */}
        {/*  > */}
        {/*    <Mail className="h-5 w-5 mr-2" />  */}
        {/*    Continue with Microsoft or Email */}
        {/*  </button> */}

        {/*  Simplified Email Login - requires EmailAuthProvider setup */}
        {/*  Uncomment and adapt if you want basic email/password (less secure) */}
        {/*  <button */}
        {/*    onClick={() => {  */}
        {/*      //  You'll need to implement a modal or separate route for email/password */}
        {/*      alert("Email/password login not yet implemented. Requires additional setup."); */}
        {/*    }} */}
        {/*    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" */}
        {/*  > */}
        {/*    <Mail className="h-5 w-5 mr-2" /> */}
        {/*    Continue with Email */}
        {/*  </button> */}
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

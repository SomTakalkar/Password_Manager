import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react'; // ✅ Import Auth0
import App from './App.tsx';
import './index.css';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const callbackUrl = import.meta.env.VITE_AUTH0_CALLBACK_URL; // Ensure this is set

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Auth0Provider
            domain={import.meta.env.VITE_AUTH0_DOMAIN}
            clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
            authorizationParams={{
                redirect_uri: import.meta.env.VITE_AUTH0_CALLBACK_URL // ✅ Ensure this matches Auth0 settings
            }}
        >
            <App />
        </Auth0Provider>
    </StrictMode>
);

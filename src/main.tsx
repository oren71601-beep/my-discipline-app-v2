import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure title and favicon are updated dynamically on load
if (typeof document !== 'undefined') {
  document.title = 'Smart Trading Journal';
  const existingFavicon = document.querySelector("link[rel*='icon']");
  if (existingFavicon) {
    existingFavicon.setAttribute('href', `/favicon.png?t=${Date.now()}`);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

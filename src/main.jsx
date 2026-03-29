import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { DonorsProvider } from './context/DonorsContext.jsx';
import { AdminAuthProvider } from './context/AdminAuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AdminAuthProvider>
        <DonorsProvider>
          <App />
        </DonorsProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  </StrictMode>
);

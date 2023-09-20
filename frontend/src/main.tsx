import { initializeApp } from 'firebase/app';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout.tsx';
import App from './pages/App.tsx';
import About from './pages/about/index.tsx';
import AuthProvider from './providers/AuthProvider.tsx';
import DocsProvider from './providers/DocsProvider.tsx';
import Authorized from './pages/authorized/index.tsx';

initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <DocsProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<App />} />
              <Route path="/about" element={<About />} />
              <Route path="/authorized" element={<Authorized />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DocsProvider>
    </AuthProvider>
  </React.StrictMode>,
);

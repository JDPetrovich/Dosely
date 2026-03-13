import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Routes, Route, HashRouter } from 'react-router-dom';
import Principal from './pages/principal/Principal';
import Remedio from './pages/remedio/remedio';
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/principal" element={<Principal />} />
        <Route path="/remedio" element={<Remedio />} />
        <Route path="*" element={<div className="not-found">404 - Página não encontrada</div>} />
      </Routes>

      <Toaster richColors />
    </HashRouter>
  </StrictMode >
);
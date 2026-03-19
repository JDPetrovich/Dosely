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
        <Route path="/configuracoes" element={
          <div className="not-found py-2 px-4">
            404 - Página não feita
            <button className="cursor-pointer bg-teal-500 hover:bg-teal-600 py-1 px-1 rounded ml-2" onClick={() => window.history.back()}>
              Voltar
            </button>
          </div>} />
        <Route path="*" element={<div className="not-found">404 - Página não encontrada </div>} />
      </Routes>

      <Toaster richColors />
    </HashRouter>
  </StrictMode >
);
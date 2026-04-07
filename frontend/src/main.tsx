import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Routes, Route, HashRouter } from 'react-router-dom';
import Login from './pages/login/Login';
import Principal from './pages/principal/Principal';
import Remedio from './pages/remedio/remedio';
import Alergia from './pages/alergia/alergia';
import { Toaster } from 'sonner';
import ProtectedRoute from './routes/protected.route';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/principal" element={<ProtectedRoute> <Principal /></ProtectedRoute>} />
        <Route path="/remedio" element={<ProtectedRoute><Remedio /></ProtectedRoute>} />
        <Route path="/alergia" element={<ProtectedRoute><Alergia /></ProtectedRoute>} />
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
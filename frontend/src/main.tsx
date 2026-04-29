import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Routes, Route, HashRouter, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import Principal from './pages/principal/Principal';
import Remedio from './pages/remedio/remedio';
import Alergia from './pages/alergia/alergia';
import { Toaster } from 'sonner';
import ProtectedRoute from './routes/protected.route';
import { PacienteProvider } from './contexts/paciente.context';
import { AuthProvider, useAuth } from './contexts/auth.context';

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="w-screen h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/principal" /> : <Login />} />
      <Route path="/principal" element={<ProtectedRoute><Principal /></ProtectedRoute>} />
      <Route path="/remedio" element={<ProtectedRoute><Remedio /></ProtectedRoute>} />
      <Route path="/alergia" element={<ProtectedRoute><Alergia /></ProtectedRoute>} />
      <Route path="/configuracoes" element={
        <div className="not-found py-2 px-4">
          404 - Página não feita
          <button className="cursor-pointer bg-teal-500 hover:bg-teal-600 py-1 px-1 rounded ml-2" onClick={() => window.history.back()}>
            Voltar
          </button>
        </div>
      } />
      <Route path="*" element={<div className="not-found">404 - Página não encontrada</div>} />
    </Routes>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <PacienteProvider>
        <HashRouter>
          <AppRoutes />
          <Toaster richColors />
        </HashRouter>
      </PacienteProvider>
    </AuthProvider>
  </StrictMode>
);
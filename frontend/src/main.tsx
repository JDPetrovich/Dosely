import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Routes, Route, HashRouter, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import Principal from './pages/principal/Principal';
import Remedio from './pages/remedio/remedio';
import Alergia from './pages/alergia/alergia';
import Tarefa from './pages/tarefa/tarefa';
import { Toaster } from 'sonner';
import ProtectedRoute from './routes/protected.route';
import { PacienteProvider } from './contexts/paciente.context';
import { AuthProvider, useAuth } from './contexts/auth.context';
import { useSystem, SystemProvider } from './contexts/system.context';

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();
  const { apiStatus } = useSystem();

  if (loading) {
    return <div className="w-screen h-screen flex items-center justify-center"></div>;
  }

  return (
    <>
      {apiStatus === "down" && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center text-white">
          API fora do ar. Contate o suporte.
        </div>
      )}

      {apiStatus === "degraded" && (
        <div className="fixed bottom-4 right-4 bg-yellow-500 text-black px-4 py-2 rounded">
          Banco indisponível. Algumas funções podem não funcionar.
        </div>
      )}

      <Routes>
        <Route path="/" element={isAuthenticated ? <Principal /> : <Login />} />
        <Route path="/principal" element={<ProtectedRoute><Principal /></ProtectedRoute>} />
        <Route path="/remedio" element={<ProtectedRoute><Remedio /></ProtectedRoute>} />
        <Route path="/alergia" element={<ProtectedRoute><Alergia /></ProtectedRoute>} />
        <Route path="/tarefa" element={<ProtectedRoute><Tarefa /></ProtectedRoute>} />
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
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <SystemProvider>
        <PacienteProvider>
          <HashRouter>
            <AppRoutes />
            <Toaster richColors />
          </HashRouter>
        </PacienteProvider>
      </SystemProvider>
    </AuthProvider>
  </StrictMode>
);
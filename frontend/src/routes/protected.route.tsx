import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/auth.context";

export default function ProtectedRoute({ children }: any) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (!isAuthenticated) return <Navigate to="/" />;

    return children;
}
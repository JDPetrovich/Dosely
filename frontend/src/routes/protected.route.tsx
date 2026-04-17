import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

export default function ProtectedRoute({ children }: any) {
    const [loading, setLoading] = useState(true);
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        async function check() {
            try {
                const res = await window.api.me();

                if (res.sucesso) {
                    setAuth(true);
                } else {
                    setAuth(false);
                    toast.error(res.mensagem || "Erro ao verificar autenticação");
                }
            } catch (error) {
                setAuth(false);
                toast.error("Erro ao conectar com o servidor");
            } finally {
                setLoading(false);
            }
        }

        check();
    }, []);

    if (loading) return <p>Carregando...</p>;

    if (!auth) return <Navigate to="/" />;

    return children;
}
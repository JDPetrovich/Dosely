import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {
    const [loading, setLoading] = useState(true);
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        async function check() {
            const res = await window.api.me();

            if (res.sucesso) {
                setAuth(true);
            } else {
                setAuth(false);
            }

            setLoading(false);
        }

        check();
    }, []);

    if (loading) return <p>Carregando...</p>;

    if (!auth) return <Navigate to="/" />;

    return children;
}
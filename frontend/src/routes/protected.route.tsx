import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {
    console.log("ProtectedRoute mounted");
    const [loading, setLoading] = useState(true);
    const [auth, setAuth] = useState<boolean | null>(null);
    useEffect(() => {
        let mounted = true;

        async function check() {
            try {
                const res = await window.api.auth.me();
                console.log("ME RESPONSE:", res);

                if (!mounted) return;

                setAuth(!!res?.sucesso);
            } catch {
                if (!mounted) return;
                setAuth(false);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        check();

        return () => {
            mounted = false;
        };
    }, []);

    if (loading || auth === null) {
        return <p>Carregando...</p>;
    }

    if (!auth) return <Navigate to="/" />;

    return children;
}
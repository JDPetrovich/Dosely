import type { IUsuario } from '@/interfaces/usuario.interface';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean | null;
    loading: boolean;
    erro: string | null
    usuario: IUsuario | null;
    clearErro: () => void;
    logout: () => void;
    refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [usuario, setUsuario] = useState<IUsuario | null>(null);
    const clearErro = () => setErro(null);

    useEffect(() => {
        async function checkAuth() {
            try {
                const res = await window.api.auth.me();
                console.log("res", res)

                if (!res?.sucesso) {
                    setIsAuthenticated(false);
                    setUsuario(null)
                    setErro(res.mensagem);
                } else {
                    setIsAuthenticated(true);
                    setUsuario(Array.isArray(res.dados) ? res.dados[0] : res.dados);
                    setErro(null);
                }

            } catch {
                setIsAuthenticated(false);
                setUsuario(null)
                setErro("Erro ao validar sessão");
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, []);

    const logout = () => {
        setIsAuthenticated(false);
        setUsuario(null);
    };

    const refresh = async () => {
        try {
            const res = await window.api.auth.me();

            if (!res?.sucesso) {
                setIsAuthenticated(false);
                setUsuario(null);
                setErro(res.mensagem);
            } else {
                setIsAuthenticated(true);
                setUsuario(Array.isArray(res.dados) ? res.dados[0] : res.dados);
                setErro(null);
            }
        } catch {
            setIsAuthenticated(false);
            setUsuario(null);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, logout, refresh, erro, clearErro, usuario }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean | null;
    loading: boolean;
    logout: () => void;
    refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let authListeners: Array<(isAuth: boolean) => void> = [];

export function notifyAuthChange(isAuthenticated: boolean) {
    authListeners.forEach(listener => listener(isAuthenticated));
}

export function addAuthListener(listener: (isAuth: boolean) => void) {
    authListeners.push(listener);
    return () => {
        authListeners = authListeners.filter(l => l !== listener);
    };
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            try {

                const res = await window.api.auth.me();
                const isAuth = !!res?.sucesso;
                setIsAuthenticated(isAuth);

            } catch (error) {
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, []);

    useEffect(() => {
        const unsubscribe = addAuthListener((isAuth) => {
            setIsAuthenticated(isAuth);
        });

        return unsubscribe;
    }, []);

    const logout = () => {
        setIsAuthenticated(false);
    };

    const refresh = async () => {
        try {
            const res = await window.api.auth.me();
            const isAuth = !!res?.sucesso;
            setIsAuthenticated(isAuth);
        } catch {
            setIsAuthenticated(false);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, logout, refresh }}>
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
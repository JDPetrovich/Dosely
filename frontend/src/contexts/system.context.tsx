import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type ApiStatus = "ok" | "down" | "degraded";

interface SystemContextType {
    apiStatus: ApiStatus;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export function SystemProvider({ children }: { children: ReactNode }) {
    const [apiStatus, setApiStatus] = useState<ApiStatus>("ok");

    useEffect(() => {
        const unsubscribe = window.api.onApiStatus((status) => {
            setApiStatus(status);
        });

        return unsubscribe;
    }, []);

    return (
        <SystemContext.Provider value={{ apiStatus }}>
            {children}
        </SystemContext.Provider>
    );
}

export function useSystem() {
    const context = useContext(SystemContext);
    if (!context) {
        throw new Error("useSystem must be used within SystemProvider");
    }
    return context;
}
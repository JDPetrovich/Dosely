import { createContext, useContext, useState } from "react";

type Paciente = {
    seqpaciente: number;
    nompaciente: string;
}

type PacienteContextType = {
    paciente: Paciente | null;
    setPaciente: (p: Paciente | null) => void;
};

const PacienteContext = createContext<PacienteContextType | null>(null);

export function PacienteProvider({ children }: { children: React.ReactNode }) {
    const [paciente, setPaciente] = useState<Paciente | null>(null);

    return (
        <PacienteContext.Provider value={{
            paciente,
            setPaciente
        }}>
            {children}
        </PacienteContext.Provider>
    );
}

export function usePaciente() {
    const ctx = useContext(PacienteContext);
    if (!ctx) throw new Error("usePaciente deve ser usado dentro do PacienteProvider");
    return ctx;
}
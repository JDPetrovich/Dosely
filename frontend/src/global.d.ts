import type { PacienteFormOutput } from "./schema/paciente.schema";

export { };

declare global {
    interface Window {
        api: {
            auth: {
                login: (dados: any) => Promise<RespostaIpc>;
                logout: () => Promise<RespostaIpc>;
                refresh: () => Promise<RespostaIpc>;
                me: () => Promise<RespostaIpc>;
            };
            pacientes: {
                buscar: () => Promise<RespostaIpc>;
                criar: (dados: PacienteFormOutput) => Promise<RespostaIpc>;
                atualizar: (dados: PacienteFormOutput) => Promise<RespostaIpc>;
                deletar: (id: number, login: string) => Promise<RespostaIpc>;
            };
            alergias: {
                buscar: () => Promise<RespostaIpc>;
            };
            alergiasPaciente: {
                buscar: (seqpaciente: number) => Promise<RespostaIpc>;
            };
            medicamentos: {
                buscar: () => Promise<RespostaIpc>;
            };
            medicamentosPaciente: {
                buscar: (seqpaciente: number) => Promise<RespostaIpc>;
            };
            tarefas: {
                buscar: () => Promise<RespostaIpc>;
                criar: (descricao: string) => Promise<RespostaIpc>;
                atualizar: (seqtarefa: number, descricao: string) => Promise<RespostaIpc>;
                alterarStatus: (seqtarefa: number, concluido: boolean) => Promise<RespostaIpc>;
            };
            onApiStatus: (callback: (status: "ok" | "down") => void) => void;
        };
    };
}

export interface RespostaIpc<T = any> {
    sucesso: boolean;
    mensagem: string;
    dados: T[];
}

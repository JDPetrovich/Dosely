import type { PacienteFormOutput } from "./schema/paciente.schema";

export { };

declare global {
    interface Window {
        api: {
            pacientes: {
                buscar: () => Promise<RespostaIpc>;
                criar: (dados: PacienteFormOutput) => Promise<RespostaIpc>;
                atualizar: (dados: PacienteFormOutput) => Promise<RespostaIpc>;
                deletar: (id: number, codpaciente: string) => Promise<RespostaIpc>;
            };
            alergias: {
                buscar: () => Promise<RespostaIpc>;
            };
            alergiasPaciente: {
                buscar: (seqpaciente: number) => Promise<RespostaIpc>;
            };
            usuario: {
                login: (dados: any) => Promise<RespostaIpc>;
            };
            me: () => Promise<RespostaIpc>;
        };
        config: {
            apiKey: string;
        };
    };
}

export interface RespostaIpc<T = any> {
    sucesso: boolean;
    mensagem: string;
    dados: T[];
}

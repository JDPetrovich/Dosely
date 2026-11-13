import type { ITratamentoDetalhado, ITratamentoBody, IMedicamentobody, IMedicamento, ITelaPaciente, IUsuario, ICriarPaciente, IEditarPaciente, IAlergia, IAlergiaPaciente } from "@dosely/shared";
import type { PacienteFormOutput } from "@/schema/paciente.schema";

export { };

declare global {
    interface Window {
        api: {
            auth: {
                login: (dados: any) => Promise<RespostaIpc>;
                logout: () => Promise<RespostaIpc>;
                refresh: () => Promise<RespostaIpc>;
                me: () => Promise<RespostaIpc<IUsuario>>;
            };
            pacientes: {
                buscar: () => Promise<RespostaIpc<ITelaPaciente>>;
                criar: (dados: PacienteFormOutput) => Promise<RespostaIpc>;
                atualizar: (dados: PacienteFormOutput) => Promise<RespostaIpc>;
                deletar: (id: number, login: string) => Promise<RespostaIpc>;
            };
            alergias: {
                buscar: () => Promise<RespostaIpc<IAlergia>>;
                criar: (descricao: string) => Promise<RespostaIpc>;
                atualizar: (seqalergia: number, descricao: string) => Promise<RespostaIpc>;
                deletar: (seqalergia: number) => Promise<RespostaIpc>;
            };
            alergiasPaciente: {
                buscar: (seqpaciente: number) => Promise<RespostaIpc<IAlergiaPaciente>>;
                associar: (seqpaciente: number, seqalergia: number) => Promise<RespostaIpc>;
                desassociar: (seqpaciente: number, seqalergia: number) => Promise<RespostaIpc>;
            };
            medicamentos: {
                buscar: () => Promise<RespostaIpc<IMedicamento>>;
                criar: (dados: IMedicamentobody) => Promise<RespostaIpc>;
                atualizar: (seqmedicamento: number, dados: IMedicamentobody) => Promise<RespostaIpc>;
                deletar: (seqmedicamento: number) => Promise<RespostaIpc>;
            };
            tratamentosPaciente: {
                buscar: (seqpaciente: number) => Promise<RespostaIpc<ITratamentoDetalhado>>;
                criar: (seqpaciente: number, dados: ITratamentoBody) => Promise<RespostaIpc>;
                atualizar: (seqpaciente: number, seqtratamento: number, dados: ITratamentoBody) => Promise<RespostaIpc>;
                deletar: (seqpaciente: number, seqtratamento: number) => Promise<RespostaIpc>;
            };
            tarefas: {
                buscar: () => Promise<RespostaIpc>;
                criar: (descricao: string) => Promise<RespostaIpc>;
                atualizar: (seqtarefa: number, descricao: string) => Promise<RespostaIpc>;
                alterarStatus: (seqtarefa: number, concluido: boolean) => Promise<RespostaIpc>;
            };
            onApiStatus: (callback: (status: "ok" | "down" | "degraded") => void) => () => void;
        };
    };
}

export interface RespostaIpc<T = unknown> {
    sucesso: boolean;
    mensagem: string;
    dados: T[];
    statusCode?: number;
}

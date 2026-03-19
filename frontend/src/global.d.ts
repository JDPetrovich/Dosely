import type { UsuarioFormOutput } from "./schema/usuario.schema";

export { };

declare global {
    interface Window {
        api: {
            usuarios: {
                buscar: () => Promise<RespostaIpc>;
                criar: (dados: UsuarioFormOutput) => Promise<RespostaIpc>;
                atualizar: (dados: UsuarioFormOutput) => Promise<RespostaIpc>;
                deletar: (id: number) => Promise<RespostaIpc>;
            };
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

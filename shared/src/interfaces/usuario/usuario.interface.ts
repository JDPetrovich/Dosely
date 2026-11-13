interface IUsuarioBase {
    nome: string;
    email: string;
}

export interface IUsuario extends IUsuarioBase {
    sequsuario: number;
    login: string;
    senha: string;
    tentativas_login: number;
    nivel_bloqueio: number;
    bloqueado_ate: number | null;
    status: 'active' | 'locked';
};
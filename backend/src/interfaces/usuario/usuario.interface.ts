interface IUsuarioBase {
    nome: string;
    email: string;
}

export default interface IUsuario extends IUsuarioBase {
    sequsuario: number;
    login: string;
    senha: string;
    tentativas_login: number;
    nivel_bloqueio: number;
    bloqueado_ate: number | null;
    status: 'active' | 'locked';
};

export interface ITelaUsuario extends IUsuarioBase {
    sequsuario: number;
}

export interface ICadastrarUsuario extends IUsuarioBase {
    login: string;
    senha: string;
}

export interface IEditarUsuario extends IUsuarioBase {
    sequsuario: number;
    login: string;
    senha?: string;
}

export interface ILogin {
    login: string;
    senha: string;
}
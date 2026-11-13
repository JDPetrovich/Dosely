export interface IUsuario {
    sequsuario: number;
    nome: string;
    email: string;
    indadmin: string;
}

export interface IDadosUsuario {
    nome: string;
    email: string;
    senha: string;
    indadmin: string;
}

export interface IUsuarioEdicao {
    sequsuario: number;
    nomeusuario: string;
    emailusuario: string;
    senha: string;
    indadmin: string;
}

export interface IUsuarioExclusao {
    sequsuario: number;
    nomeusuario: string;
}

export type IAdicionarUsuarioProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    obterPermissoes: () => Promise<void>
    usuarioEdicao?: IUsuarioEdicao | null
}
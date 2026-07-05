export interface IRefreshToken {
    id: number;
    sequsuario: number;
    token: string;
    expira_em: number;
    revogado: 0 | 1;
    criado_em: number;
}
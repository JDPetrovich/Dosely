export default interface IUsuario {
    sequsuario: number;
    login: string;
    senha: string;
    nome: string;
    loginAttempts: number;
    failedBlocks: number;
    lockUntil: number | null;
    status: 'active' | 'locked';
};
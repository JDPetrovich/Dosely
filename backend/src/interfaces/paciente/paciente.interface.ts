interface IPacienteBase {
    nome: string;
    data_nascimento: string;
    cpf: string;
    telefone: string;
    email: string;
}

export default interface IPaciente extends IPacienteBase {
    seqpaciente: number;
    sequsuario: number; 
    login: string;
    senha: string;
}

export interface ITelaPaciente extends IPacienteBase {
    seqpaciente: number;
}

export interface ICadastrarPaciente extends IPacienteBase {
    sequsuario: number;
    login: string;
    senha: string;
}

export interface IEditarPaciente extends IPacienteBase {
    seqpaciente: number;
    sequsuario: number;
    login: string;
    senha?: string;
}

export interface ILoginPaciente {
    login: string;
    senha: string;
}
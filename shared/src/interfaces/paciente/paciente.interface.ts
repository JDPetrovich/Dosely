interface IPacienteBase {
    nome: string;
    data_nascimento: string;
    cpf: string;
    telefone: string;
    email: string;
}

export interface IPacienteBody extends IPacienteBase {
    login: string;
    senha: string;
}

export interface IPaciente extends IPacienteBody {
    seqpaciente: number;
    sequsuario: number;
}

export interface ITelaPaciente extends IPacienteBase {
    seqpaciente: number;
    login: string;
}

export interface ICriarPaciente extends IPacienteBody {
    sequsuario: number;
}

export interface IEditarPaciente extends IPacienteBase {
    seqpaciente: number;
    sequsuario: number;
    login: string;
    senha?: string;
}

export interface Ilogin {
    login: string;
    senha: string;
}
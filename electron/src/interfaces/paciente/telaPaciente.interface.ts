export default interface ITelaPaciente {
    seqpaciente: number,
    nome: string,
    data_nascimento: string,
    login: string,
    cpf: string,
    telefone?: string,
    email?: string
}


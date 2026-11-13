export default interface IPaciente {
    seqpaciente: number,
    nome: string,
    data_nascimento: string,
    login: string,
    senha: string,
    cpf: string,
    telefone?: string,
    email?: string
}
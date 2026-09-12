export default interface IPaciente {
    seqpaciente: number,
    nomepaciente: string,
    dtnascimentopaciente: string,
    login: string,
    senhapaciente: string,
    cpfpaciente: string,
    telpaciente?: string,
    emailpaciente?: string
}
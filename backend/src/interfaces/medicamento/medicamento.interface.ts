export default interface IMedicamento {
    seqmedicamento?: number;
    nomemedicamento?: string;
    descmedicamento?: string;
    dosagem?: string;
}

export interface IMedicamentoPaciente {
    seqpaciente: number;
    seqmedicamento: number;
    descmedicamento?: string;
}
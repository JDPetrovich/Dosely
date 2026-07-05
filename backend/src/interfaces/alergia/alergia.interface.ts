export default interface IAlergia {
    seqalergia?: number;
    descricaoalergia?: string;
}

export interface IAlergiaPaciente {
    seqpaciente: number;
    seqalergia: number;
    descalergia?: string;
}
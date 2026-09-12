interface IMedicamentoPacienteBase {
    status: boolean;
    tipo: string;
    estoque: number;
    tipo_horario: string;
    horario: string;
    tipo_periodo: string;
    periodo: string;
}

export default interface IMedicamentoPaciente extends IMedicamentoPacienteBase {
    seqmedicamentopaciente: number;
    seqpaciente: number;
    seqmedicamento: number;
}

export interface ICadastrarMedicamentoPaciente extends IMedicamentoPacienteBase {
    seqpaciente: number;
    seqmedicamento: number;
}

export interface IEditarMedicamentoPaciente extends IMedicamentoPacienteBase {
    seqmedicamentopaciente: number;
    seqpaciente: number;
    seqmedicamento: number;
}
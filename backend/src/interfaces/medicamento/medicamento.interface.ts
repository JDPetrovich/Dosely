interface IMedicamentoBase {
    nome: string;
    descricao: string;
    dosagem: string;
}

export default interface IMedicamento extends IMedicamentoBase {
    seqmedicamento: number;
    sequsuario: number;
}

export interface ICadastrarMedicamento extends IMedicamentoBase {
    sequsuario: number;
}

export interface IEditarMedicamento extends IMedicamentoBase {
    seqmedicamento: number;
    sequsuario: number;
}
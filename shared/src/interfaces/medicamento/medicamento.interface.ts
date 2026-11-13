interface IMedicamentoBase {
    nome: string;
    descricao: string;
    dosagem: string;
}

export interface IMedicamentobody extends IMedicamentoBase { }

export interface IMedicamento extends IMedicamentoBase {
    seqmedicamento: number;
    sequsuario: number;
}

export interface ICriarMedicamento extends IMedicamentoBase {
    sequsuario: number;
}

export interface IEditarMedicamento extends IMedicamentoBase {
    seqmedicamento: number;
    sequsuario: number;
}
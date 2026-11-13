interface IAlergiaBase {
    descricao: string;
}

export interface IAlergiaBody extends IAlergiaBase { }

export interface IAlergia extends IAlergiaBody {
    seqalergia: number;
    sequsuario: number;
}

export interface ICriarAlergia extends IAlergiaBase {
    sequsuario: number;
}

export interface IEditarAlergia extends IAlergiaBase {
    seqalergia: number;
    sequsuario: number;
}

export interface IAlergiaPaciente {
    seqpaciente: number;
    seqalergia: number;
    descricao: string;
}

export interface IAssociarAlergiaBody {
    seqalergia: number;
}
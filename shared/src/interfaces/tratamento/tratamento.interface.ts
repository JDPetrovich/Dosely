export type TipoRepeticao = "DIARIA" | "A_CADA_DIAS";

export type TipoHorario = "EXATO" | "INTERVALO";

export interface ITratamentoItemBase {
    seqmedicamento: number;
    quantidade: number;
    unidade: string;
    estoque: number;
}

export interface ICriarTratamentoItem extends ITratamentoItemBase { }

export interface ITratamentoItem extends ITratamentoItemBase {
    seqtratamentoitem: number;
    seqtratamento: number;
}

export interface ITratamentoHorario {
    seqtratamentohorario: number;
    seqtratamento: number;
    horario: string;
}

interface ITratamentoBase {
    ativo: boolean;
    data_inicio: string;
    data_fim?: string | null;
    itens: ICriarTratamentoItem[];
}

interface ITratamentoHorarioExato {
    tipo_horario: "EXATO";
    horarios: string[];
    horario_inicio?: never;
    intervalo_horas?: never;
}

interface ITratamentoHorarioIntervalo {
    tipo_horario: "INTERVALO";
    horario_inicio: string;
    intervalo_horas: number;
    horarios?: never;
}

type IRegraHorario = ITratamentoHorarioExato | ITratamentoHorarioIntervalo;

interface ITratamentoDiario {
    tipo_repeticao: "DIARIA";
    intervalo_dias?: never;
}

interface ITratamentoACadaDias {
    tipo_repeticao: "A_CADA_DIAS";
    intervalo_dias: number;
}

type IRegraRepeticao = ITratamentoDiario | ITratamentoACadaDias;

export type ITratamentoBody = ITratamentoBase & IRegraHorario & IRegraRepeticao;

export type ICriarTratamento = ITratamentoBody & {
    seqpaciente: number;
};

export interface ITratamento {
    seqtratamento: number;
    seqpaciente: number;
    ativo: boolean;
    data_inicio: string;
    data_fim: string | null;
    tipo_repeticao: TipoRepeticao;
    intervalo_dias: number | null;
    tipo_horario: TipoHorario;
    horario_inicio: string | null;
    intervalo_horas: number | null;
}

export interface ITratamentoItemDetalhado extends ITratamentoItem {
    nome: string;
    descricao: string;
    dosagem: string;
}

export interface ITratamentoDetalhado extends ITratamento {
    horarios: ITratamentoHorario[];
    itens: ITratamentoItemDetalhado[];
}

export type IEditarTratamento = ITratamentoBody & {
    seqtratamento: number;
    seqpaciente: number;
}
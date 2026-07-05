export interface IMedicamentoPaciente {
    seqmedicamentopaciente: number;
    tipo_registro: 'unitario' | 'combo';
    nome_principal: string | null;
    dosagem_principal: string | null;
    stock: number;
    tipohorario: 'exato' | 'intervalo';
    horario: string;
    tipoperiodo: 'continuo' | 'especifico';
    periodo: string;
    item_nome: string | null;
    item_dosagem: string | null;
}
import { ICadastrarTratamento } from "../../interfaces/medicamento/tratamento.interface.js";
import { getDatabase } from "../../module/sqlitedb/dbInstance.js";

const db = getDatabase();

export class TratamentoRepository {
    /*  async buscarMedicamentos(seqpaciente: number): Promise<ITratamento[]> {
         const query = `
     SELECT 
     seqmedicamentopaciente,
     tipo_registro,
     nome_principal,
     dosagem_principal,
     stock,
     tipohorario,
     horario,
     tipoperiodo,
     periodo,
     item_nome,
     item_dosagem
 FROM (
     SELECT 
         mp.seqmedicamentopaciente,
         mp.tipo AS tipo_registro,
         m.nomemedicamento AS nome_principal,
         m.dosagem AS dosagem_principal,
         mp.stock,
         mp.tipohorario,
         mp.horario,
         mp.tipoperiodo,
         mp.periodo,
         NULL AS item_nome,
         NULL AS item_dosagem
     FROM medicamento_paciente mp
     LEFT JOIN medicamento m ON mp.seqmedicamento = m.seqmedicamento
     WHERE mp.seqpaciente = ?
       AND mp.tipo = 'unitario'
 
     UNION ALL
 
     SELECT 
         mp.seqmedicamentopaciente,
         mp.tipo AS tipo_registro,
         NULL AS nome_principal,
         NULL AS dosagem_principal,
         mp.stock,
         mp.tipohorario,
         mp.horario,
         mp.tipoperiodo,
         mp.periodo,
         m_item.nomemedicamento AS item_nome,
         m_item.dosagem AS item_dosagem
     FROM medicamento_paciente mp
     LEFT JOIN combo_item ci ON ci.seqmedicamentopaciente_combo = mp.seqmedicamentopaciente
     LEFT JOIN medicamento m_item ON ci.seqmedicamento_item = m_item.seqmedicamento
     WHERE mp.seqpaciente = ?
       AND mp.tipo = 'combo'
 ) AS combined
 ORDER BY seqmedicamentopaciente, item_nome;
     `;
 
         const parametros = [seqpaciente, seqpaciente];
 
         const resultado = await db.consultar<ITratamento>(query, parametros);
         return resultado;
     } */

    async criarTratamento(medicamento: ICadastrarTratamento) {
        const query = `
            INSERT INTO medicamento_paciente (
                seqpaciente,
                seqmedicamento,
                status,
                tipo,
                stock,
                tipohorario,
                horario,
                tipoperiodo,
                periodo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            medicamento.seqpaciente,
            medicamento.seqmedicamento,
            medicamento.status ? 1 : 0,
            medicamento.tipo,
            medicamento.estoque,
            medicamento.tipo_horario,
            medicamento.horario,
            medicamento.tipo_periodo,
            medicamento.periodo
        ];
        await db.executar(query, params);
    }
}
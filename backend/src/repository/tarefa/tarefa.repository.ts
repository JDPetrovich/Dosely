import { getSupabase } from "../../module/supabase/supabaseInstance.js";
import { getDatabase } from "../../module/sqlitedb/dbInstance.js";
import ITarefa from "../../interfaces/tarefa/tarefa.interface.js";
const db = getDatabase();

export class TarefaRepository {
    async buscarTarefas(): Promise<ITarefa[]> {
        const query = `
      SELECT 
        seqtarefa,
        descricao,
        concluido
      FROM tarefa
      ORDER BY concluido ASC
    `;

        const resultado = await db.consultar<ITarefa>(query, []);
        return resultado;
    }

    async criarTarefa(descricao: string) {
        const query = `
        INSERT INTO tarefa (descricao, concluido)
        VALUES (?, 0)
      `;
        const parametros = [descricao];

        await db.executar(query, parametros);
        return;
    }

    async atualizarTarefa(seqtarefa: number, descricao: string) {
        const query = `
        UPDATE tarefa
        SET descricao = ?
        WHERE seqtarefa = ?
      `;

        const parametros = [descricao, seqtarefa];

        await db.executar(query, parametros);
        return;
    }

    async concluirTarefa(seqtarefa: number, concluido: boolean) {
        const query = `
        UPDATE tarefa
        SET concluido = ?
        WHERE seqtarefa = ?
      `;

        const parametros = [
            concluido ? 1 : 0,
            seqtarefa
        ];

        await db.executar(query, parametros);
        return;
    }

}
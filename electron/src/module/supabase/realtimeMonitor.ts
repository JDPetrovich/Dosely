import { getDatabase } from "../sqlitedb/dbInstance.js";
import { getSupabase } from "./supabaseInstance.js";

export async function iniciarMonitoramentoRealtime() {
    const supabase = getSupabase();
    const db = getDatabase();

    try {
        const { data, error } = await supabase
            .from('historico_remedios')
            .select('*');

        if (error) throw error;

        if (data && data.length > 0) {
            for (const historico of data) {
                try {
                    const query = `
                    INSERT OR IGNORE INTO historico_remedios (
                    seqhistorico, 
                    sequsuario, 
                    descremedio,
                    status, 
                    dataconfimacao
                    ) VALUES (?, ?, ?, ?, ?)
                    `
                    const parametros = [
                        historico.id,
                        historico.sequsuario,
                        historico.descricaoremedio,
                        historico.status,
                        historico.datahora
                    ]
                    await db.executar(query, parametros);
                } catch (err) {
                    console.error("Erro ao sincronizar historico:", historico.id, err);
                }
            }
        }
    } catch (error) {
        console.error("Erro na sincronização inicial:", error);
    }

    supabase
        .channel('fluxo-remedios')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'historico_remedios'
            },
            async (payload) => {
                const dados = payload.new;

                try {
                    const query = `
                    INSERT INTO historico_remedios (
                    seqhistorico, 
                    sequsuario, 
                    descremedio, 
                    status, 
                    dataconfimacao
                    ) VALUES (?, ?, ?, ?, ?)
                    `
                    const porametros = [
                        dados.id,
                        dados.sequsuario,
                        dados.descricaoremedio,
                        dados.status,
                        dados.datahora
                    ]

                    await db.executar(query, porametros);
                } catch (error) {
                    console.error("Erro ao salvar dados do Supabase no SQLite:", error);
                }

            }
        )
        .subscribe();
}
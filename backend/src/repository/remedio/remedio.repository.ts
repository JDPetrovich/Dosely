import { getDatabase } from "../../module/sqlitedb/dbInstance.js";
import { getSupabase } from "../../module/supabase/supabaseInstance.js";

const db = getDatabase();
const supabase = getSupabase();

export class RemedioRepository {
    async buscarRemedios(): Promise<any> {
        const query = `
        `;
        const resultado = await db.consultar<any>(query);
        return resultado;
    }
}
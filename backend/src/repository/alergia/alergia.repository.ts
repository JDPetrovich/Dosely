import { getSupabase } from "../../module/supabase/supabaseInstance.js";
import { getDatabase } from "../../module/sqlitedb/dbInstance.js";
import IAlergia from "../../interfaces/alergia/alergia.interface.js";

const db = getDatabase();

export class AlergiaRepository {
  async buscarAlergias(): Promise<IAlergia[]> {
    const query = `
      SELECT 
        seqalergia,
        descalergia
      FROM alergia
    `;

    const resultado = await db.consultar<IAlergia>(query, []);
    return resultado;
  }
}
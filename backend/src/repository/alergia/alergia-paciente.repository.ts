import { IAlergiaPaciente } from "../../interfaces/alergia/alergia.interface.js";
import { getDatabase } from "../../module/sqlitedb/dbInstance.js";
import { getSupabase } from "../../module/supabase/supabaseInstance.js";

const db = getDatabase();
const supabase = getSupabase();

export class AlergiaPacienteRepository {
    async buscarAlergias(seqpaciente: number): Promise<IAlergiaPaciente[]> {
        const query = `
      SELECT 
      au.seqpaciente,
      au.seqalergia,
      a.descalergia
      FROM alergia_paciente au
      JOIN alergia a 
      ON a.seqalergia = au.seqalergia
      WHERE au.seqpaciente = ?;
    `;

        const parametros = [seqpaciente];

        const resultado = await db.consultar<IAlergiaPaciente>(query, parametros);
        return resultado;
    }
}
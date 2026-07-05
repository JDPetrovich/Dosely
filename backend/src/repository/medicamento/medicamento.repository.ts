import IMedicamento from "../../interfaces/medicamento/medicamento.interface.js";
import { getDatabase } from "../../module/sqlitedb/dbInstance.js";

const db = getDatabase();

export class MedicamentoRepository {
    async buscarMedicamentos(): Promise<IMedicamento[]> {
        const query = `
      SELECT 
        seqmedicamento,
        nomemedicamento,
        descmedicamento,
        dosagem
      FROM medicamento
    `;

        const resultado = await db.consultar<IMedicamento>(query, []);
        return resultado;
    }
}
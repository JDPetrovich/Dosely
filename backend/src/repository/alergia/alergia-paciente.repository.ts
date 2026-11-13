import type { IAlergiaPaciente } from "@dosely/shared";
import { getDatabase } from "../../module/sqlitedb/dbInstance.js";

const db = getDatabase();

export class AlergiaPacienteRepository {
    async buscarAlergias(seqpaciente: number): Promise<IAlergiaPaciente[]> {
        const query = `
      SELECT 
        au.seqpaciente,
        au.seqalergia,
        a.descricao
      FROM alergia_paciente au
      JOIN alergia a 
      ON a.seqalergia = au.seqalergia
      WHERE au.seqpaciente = ?;
    `;
        return db.consultar<IAlergiaPaciente>(query, [seqpaciente]);
    }

    async buscarAssociacao(seqpaciente: number, seqalergia: number) {
        const query = `
      SELECT seqpaciente, seqalergia
      FROM alergia_paciente
      WHERE seqpaciente = ? AND seqalergia = ?
    `;
        const resultado = await db.consultar<IAlergiaPaciente>(query, [seqpaciente, seqalergia]);
        return resultado[0];
    }

    async associarAlergia(seqpaciente: number, seqalergia: number) {
        const query = `
      INSERT INTO alergia_paciente (seqpaciente, seqalergia)
      VALUES (?, ?)
    `;
        await db.executar(query, [seqpaciente, seqalergia]);
    }

    async desassociarAlergia(seqpaciente: number, seqalergia: number) {
        const query = `
      DELETE FROM alergia_paciente
      WHERE seqpaciente = ? AND seqalergia = ?
    `;
        await db.executar(query, [seqpaciente, seqalergia]);
    }
}
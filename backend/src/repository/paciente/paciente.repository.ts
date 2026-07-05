import bcrypt from "bcrypt";
import IPaciente from "../../interfaces/paciente/paciente.interface.js";
import { getDatabase } from "../../module/sqlitedb/dbInstance.js";
import { getSupabase } from "../../module/supabase/supabaseInstance.js";

const db = getDatabase();
const supabase = getSupabase();

export class PacienteRepository {
    async buscarPacientes(): Promise<IPaciente[]> {
        const query = `
      SELECT 
        seqpaciente,
        nomepaciente,
        dtnascimentopaciente,
        codpaciente,
        cpfpaciente,
        telpaciente,
        emailpaciente
      FROM paciente
    `;

        const resultado = await db.consultar<IPaciente>(query, []);
        return resultado;
    }

    async criarPaciente(dadosPaciente: IPaciente): Promise<void> {
        const senha = await bcrypt.hash(dadosPaciente.senhapaciente, 10);

        const queryInsert = `
      INSERT INTO paciente (
        nomepaciente,
        dtnascimentopaciente,
        codpaciente,
        senhapaciente,
        cpfpaciente,
        telpaciente,
        emailpaciente
      ) VALUES (?,?,?,?,?,?,?)
    `;

        try {
            await db.executar(queryInsert, [
                dadosPaciente.nomepaciente,
                dadosPaciente.dtnascimentopaciente,
                dadosPaciente.codpaciente,
                senha,
                dadosPaciente.cpfpaciente,
                dadosPaciente.telpaciente,
                dadosPaciente.emailpaciente,
            ]);
        } catch (err) {
            throw new Error("Erro ao criar paciente no banco local");
        }

        try {
            const { error } = await supabase.from("pacientes").insert([
                {
                    nomepaciente: dadosPaciente.nomepaciente,
                    codpaciente: dadosPaciente.codpaciente,
                    senhapaciente: senha,
                },
            ]);

            if (error) {
                await db.executar("DELETE FROM paciente WHERE codpaciente = ?", [dadosPaciente.codpaciente]);
                throw new Error("Erro ao espelhar no Supabase: " + error.message);
            }
        } catch (err) {
            throw err;
        }
    }

    async atualizarPaciente(dadosPaciente: IPaciente): Promise<void> {
        const query = `
      UPDATE paciente SET 
        nomepaciente = ?, 
        dtnascimentopaciente = ?, 
        codpaciente = ?, 
        senhapaciente = ?, 
        cpfpaciente = ?,
        telpaciente = ?,
        emailpaciente = ?
      WHERE seqpaciente = ?
    `;

        const senha = await bcrypt.hash(dadosPaciente.senhapaciente, 10);

        try {
            await db.executar(query, [
                dadosPaciente.nomepaciente,
                dadosPaciente.dtnascimentopaciente,
                dadosPaciente.codpaciente,
                senha,
                dadosPaciente.cpfpaciente,
                dadosPaciente.telpaciente,
                dadosPaciente.emailpaciente,
                dadosPaciente.seqpaciente,
            ]);
        } catch (err) {
            throw new Error("Erro ao atualizar paciente no banco local");
        }

        try {
            const { error } = await supabase
                .from("pacientes")
                .update({
                    nomepaciente: dadosPaciente.nomepaciente,
                    codpaciente: dadosPaciente.codpaciente,
                    senhapaciente: senha,
                })
                .eq("codpaciente", dadosPaciente.codpaciente);

            if (error) throw new Error("Erro ao espelhar no Supabase: " + error.message);
        } catch (err) {
            throw err;
        }
    }

    async deletarPaciente(seqpaciente: number, codpaciente: string): Promise<void> {
        const query = `DELETE FROM paciente WHERE seqpaciente = ?`;
        const parametros = [seqpaciente];

        let resultado;
        try {
            resultado = await db.executar(query, parametros);
        } catch (err) {
            throw new Error("Erro ao deletar paciente no banco local");
        }

        if (!resultado || resultado.changes === 0) {
            throw new Error("Paciente não encontrado");
        }

        const { error } = await supabase
            .from("pacientes")
            .delete()
            .eq("codpaciente", codpaciente);

        if (error) throw new Error("Erro ao espelhar no Supabase: " + error.message);
    }
}
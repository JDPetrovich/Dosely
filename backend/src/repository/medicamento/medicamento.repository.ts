import IMedicamento, { ICadastrarMedicamento, IEditarMedicamento } from "../../interfaces/medicamento/medicamento.interface.js";
import { getDatabase } from "../../module/sqlitedb/dbInstance.js";

const db = getDatabase();

export class MedicamentoRepository {
  async buscarMedicamentos(sequsuario: number): Promise<IMedicamento[]> {
    const query = `
      SELECT 
        seqmedicamento,
        sequsuario,
        nome,
        descricao,
        dosagem
      FROM medicamento WHERE sequsuario = ?
    `;

    const params = [sequsuario];
    const resultado = await db.consultar<IMedicamento>(query, params);
    return resultado;
  }

  async buscarMedicamentoPorSeq(seqmedicamento: number, sequsuario: number) {
    const query = `
      SELECT 
        seqmedicamento,
        sequsuario,
        nome,
        descricao,
        dosagem
      FROM medicamento WHERE seqmedicamento = ? AND sequsuario = ?
    `;

    const params = [seqmedicamento, sequsuario];
    const resultado = await db.consultar<IMedicamento>(query, params);
    return resultado[0];
  }

  async criarMedicamento(medicamento: ICadastrarMedicamento) {
    const query = `
    INSERT INTO medicamento(
      sequsuario,
      nome,
      descricao,
      dosagem
    ) VALUES (?,?,?,?)
    `;

    const params = [
      medicamento.sequsuario,
      medicamento.nome,
      medicamento.descricao,
      medicamento.dosagem
    ];
    await db.executar(query, params);
  }

  async atualizarMedicamento(medicamento: IEditarMedicamento) {
    const query = `
    UPDATE medicamento SET 
      nome = ?,
      descricao = ?,
      dosagem = ?
    WHERE seqmedicamento = ? AND sequsuario = ?
    `;

    const params = [
      medicamento.nome,
      medicamento.descricao,
      medicamento.dosagem,
      medicamento.seqmedicamento,
      medicamento.sequsuario
    ];
    await db.executar(query, params);
  }

  async deletarMedicamento(seqmedicamento: number, sequsuario: number) {
    const query = `DELETE FROM medicamento WHERE seqmedicamento = ? AND sequsuario = ?`;
    const params = [seqmedicamento, sequsuario];

    await db.executar(query, params);
  }
}
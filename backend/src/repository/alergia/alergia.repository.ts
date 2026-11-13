import type { IAlergia, ICriarAlergia, IEditarAlergia } from "@dosely/shared";
import { getDatabase } from "../../module/sqlitedb/dbInstance.js";

const db = getDatabase();

export class AlergiaRepository {
  async buscarAlergias(sequsuario: number): Promise<IAlergia[]> {
    const query = `
      SELECT 
        seqalergia,
        sequsuario,
        descricao
      FROM alergia
      WHERE sequsuario = ?
    `;
    return db.consultar<IAlergia>(query, [sequsuario]);
  }

  async buscarAlergiaPorSeq(seqalergia: number, sequsuario: number) {
    const query = `
      SELECT 
        seqalergia,
        sequsuario,
        descricao
      FROM alergia
      WHERE seqalergia = ? AND sequsuario = ?
    `;
    const resultado = await db.consultar<IAlergia>(query, [seqalergia, sequsuario]);
    return resultado[0];
  }

  async buscarAlergiaPorDescricao(descricao: string, sequsuario: number) {
    const query = `
      SELECT seqalergia
      FROM alergia
      WHERE descricao = ? AND sequsuario = ?
    `;
    const resultado = await db.consultar<IAlergia>(query, [descricao, sequsuario]);
    return resultado[0];
  }

  async criarAlergia(alergia: ICriarAlergia) {
    const query = `
      INSERT INTO alergia (sequsuario, descricao)
      VALUES (?, ?)
    `;
    await db.executar(query, [alergia.sequsuario, alergia.descricao]);
  }

  async atualizarAlergia(alergia: IEditarAlergia) {
    const query = `
      UPDATE alergia
      SET descricao = ?
      WHERE seqalergia = ? AND sequsuario = ?
    `;
    await db.executar(query, [alergia.descricao, alergia.seqalergia, alergia.sequsuario]);
  }

  async deletarAlergia(seqalergia: number, sequsuario: number) {
    const query = `DELETE FROM alergia WHERE seqalergia = ? AND sequsuario = ?`;
    await db.executar(query, [seqalergia, sequsuario]);
  }
}
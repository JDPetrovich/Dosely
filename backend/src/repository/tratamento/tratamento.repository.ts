import { getDatabase } from "../../module/sqlitedb/dbInstance.js";
import type { ICriarTratamento, ITratamento, ITratamentoHorario, ITratamentoDetalhado, ITratamentoItemDetalhado, IEditarTratamento } from "@dosely/shared";

const db = getDatabase();

export class TratamentoRepository {
    async buscarTratamentosPorPaciente(seqpaciente: number, sequsuario: number): Promise<ITratamentoDetalhado[]> {
        const tratamentos = await db.consultar<ITratamento>(
            `
                SELECT
                    t.seqtratamento,
                    t.seqpaciente,
                    t.ativo,
                    t.data_inicio,
                    t.data_fim,
                    t.tipo_repeticao,
                    t.intervalo_dias,
                    t.tipo_horario,
                    t.horario_inicio,
                    t.intervalo_horas
                FROM tratamento t
                INNER JOIN paciente p
                    ON t.seqpaciente = p.seqpaciente
                WHERE t.seqpaciente = ?
                  AND p.sequsuario = ?
                ORDER BY t.ativo DESC, t.data_inicio DESC   
            `,
            [seqpaciente, sequsuario]
        );

        if (tratamentos.length === 0) {
            return [];
        }

        const idsTratamentos = tratamentos.map(
            ({ seqtratamento }) => seqtratamento
        );

        const placeholders = idsTratamentos.map(() => "?").join(", ");

        const horarios = await db.consultar<ITratamentoHorario>(
            `
                SELECT
                    seqtratamentohorario,
                    seqtratamento,
                    horario
                FROM tratamento_horario
                WHERE seqtratamento IN (${placeholders})
                ORDER BY horario
            `,
            idsTratamentos
        );

        const itens = await db.consultar<ITratamentoItemDetalhado>(
            `
                SELECT
                    ti.seqtratamentoitem,
                    ti.seqtratamento,
                    ti.seqmedicamento,
                    ti.quantidade,
                    ti.unidade,
                    ti.estoque,
                    m.nome,
                    m.descricao,
                    m.dosagem
                FROM tratamento_item ti
                INNER JOIN medicamento m
                    ON ti.seqmedicamento = m.seqmedicamento
                WHERE ti.seqtratamento IN (${placeholders})
                ORDER BY ti.seqtratamentoitem, m.nome
            `,
            idsTratamentos
        );

        const horariosPorTratamento = new Map<number, ITratamentoHorario[]>();
        for (const horario of horarios) {
            const lista = horariosPorTratamento.get(horario.seqtratamento) ?? [];

            lista.push(horario);
            horariosPorTratamento.set(horario.seqtratamento, lista);
        }

        const itensPorTratamento = new Map<number, ITratamentoItemDetalhado[]>();
        for (const item of itens) {
            const lista = itensPorTratamento.get(item.seqtratamento) ?? [];

            lista.push(item);
            itensPorTratamento.set(item.seqtratamento, lista);
        }

        return tratamentos.map((tratamento) => ({
            ...tratamento,
            ativo: Boolean(tratamento.ativo),
            horarios: horariosPorTratamento.get(tratamento.seqtratamento) ?? [],
            itens: itensPorTratamento.get(tratamento.seqtratamento) ?? []
        }))
    }

    async buscarTratamentoPorSeq(seqtratamento: number, seqpaciente: number, sequsuario: number): Promise<ITratamento | null> {
        return db.consultarUm<ITratamento>(
            `
            SELECT
                t.seqtratamento,
                t.seqpaciente,
                t.ativo,
                t.data_inicio,
                t.data_fim,
                t.tipo_repeticao,
                t.intervalo_dias,
                t.tipo_horario,
                t.horario_inicio,
                t.intervalo_horas
            FROM tratamento t
            INNER JOIN paciente p
                ON p.seqpaciente = t.seqpaciente
            WHERE t.seqtratamento = ?
              AND t.seqpaciente = ?
              AND p.sequsuario = ?
        `,
            [seqtratamento, seqpaciente, sequsuario]
        );
    }

    async criarTratamento(dados: ICriarTratamento): Promise<number> {
        await db.begin();

        try {
            const intervaloDias = dados.tipo_repeticao === "A_CADA_DIAS" ? dados.intervalo_dias : null;
            const horarioInicio = dados.tipo_horario === "INTERVALO" ? dados.horario_inicio : null;
            const intervaloHoras = dados.tipo_horario === "INTERVALO" ? dados.intervalo_horas : null;

            const resultado = await db.executar(
                `
                INSERT INTO tratamento(
            seqpaciente,
            ativo,
            data_inicio,
            data_fim,
            tipo_repeticao,
            intervalo_dias,
            tipo_horario,
            horario_inicio,
            intervalo_horas
        ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
                [
                    dados.seqpaciente,
                    dados.ativo ? 1 : 0,
                    dados.data_inicio,
                    dados.data_fim ?? null,
                    dados.tipo_repeticao,
                    intervaloDias,
                    dados.tipo_horario,
                    horarioInicio,
                    intervaloHoras
                ]
            );

            const seqtratamento = resultado.lastID;

            if (seqtratamento === undefined) {
                throw new Error("Não foi possivel obter o identificador do tratamento criado.");
            }

            if (dados.tipo_horario === "EXATO") {
                for (const horario of dados.horarios) {
                    await db.executar(
                        `
                        INSERT INTO tratamento_horario(
                seqtratamento,
                horario
            ) VALUES(?, ?)
                `,
                        [seqtratamento, horario]
                    );
                }
            }

            for (const item of dados.itens) {
                await db.executar(
                    `
                    INSERT INTO tratamento_item(
                    seqtratamento,
                    seqmedicamento,
                    quantidade,
                    unidade,
                    estoque
                ) VALUES(?, ?, ?, ?, ?)
                    `,
                    [
                        seqtratamento,
                        item.seqmedicamento,
                        item.quantidade,
                        item.unidade.trim(),
                        item.estoque
                    ]
                );
            }
            await db.commit();

            return seqtratamento;
        } catch (error) {
            await db.rollback();
            throw error;
        }
    }

    async atualizarTratamento(dados: IEditarTratamento): Promise<void> {
        await db.begin();

        try {
            const intervaloDias = dados.tipo_repeticao === "A_CADA_DIAS" ? dados.intervalo_dias : null;
            const horarioInicio = dados.tipo_horario === "INTERVALO" ? dados.horario_inicio : null;
            const intervaloHoras = dados.tipo_horario === "INTERVALO" ? dados.intervalo_horas : null;

            await db.executar(
                `
                UPDATE tratamento
                SET ativo = ?,
                    data_inicio = ?,
                    data_fim = ?,
                    tipo_repeticao = ?,
                    intervalo_dias = ?,
                    tipo_horario = ?,
                    horario_inicio = ?,
                    intervalo_horas = ?
                WHERE seqtratamento = ?
                  AND seqpaciente = ?
                `,
                [
                    dados.ativo ? 1 : 0,
                    dados.data_inicio,
                    dados.data_fim ?? null,
                    dados.tipo_repeticao,
                    intervaloDias,
                    dados.tipo_horario,
                    horarioInicio,
                    intervaloHoras,
                    dados.seqtratamento,
                    dados.seqpaciente
                ]
            );

            await db.executar(
                `
                DELETE FROM tratamento_horario
                WHERE seqtratamento = ?
            `,
                [dados.seqtratamento]
            );

            await db.executar(
                `
                DELETE FROM tratamento_item
                WHERE seqtratamento = ?
            `,
                [dados.seqtratamento]
            );

            if (dados.tipo_horario === "EXATO") {
                for (const horario of dados.horarios) {
                    await db.executar(
                        `
                        INSERT INTO tratamento_horario(
                        seqtratamento,
                        horario
                        ) VALUES(?, ?)
                        `,
                        [dados.seqtratamento, horario]
                    );
                }
            }

            for (const item of dados.itens) {
                await db.executar(
                    `
                    INSERT INTO tratamento_item(
                    seqtratamento,
                    seqmedicamento,
                    quantidade,
                    unidade,
                    estoque
                ) VALUES(?, ?, ?, ?, ?)
                    `,
                    [
                        dados.seqtratamento,
                        item.seqmedicamento,
                        item.quantidade,
                        item.unidade.trim(),
                        item.estoque
                    ]
                );
            }
            await db.commit();
        } catch (error) {
            await db.rollback();
            throw error;
        }
    }

    async deletarTratamento(seqtratamento: number, seqpaciente: number): Promise<void> {
        await db.begin();

        try {
            await db.executar(
                `
                DELETE FROM tratamento
                WHERE seqtratamento = ?
                  AND seqpaciente = ?
            `,
                [seqtratamento, seqpaciente]
            );

            await db.commit();
        } catch (error) {
            await db.rollback();
            throw error;
        }
    }
}
import { AppError } from "../../errors/app.error.js";
import { MedicamentoRepository } from "../../repository/medicamento/medicamento.repository.js";
import { PacienteRepository } from "../../repository/paciente/paciente.repository.js";
import { TratamentoRepository } from "../../repository/tratamento/tratamento.repository.js";
import type { ICriarTratamento, ICriarTratamentoItem, IEditarTratamento, ITratamentoDetalhado } from "@dosely/shared";
const medicamentoRepo = new MedicamentoRepository();
const pacienteRepo = new PacienteRepository();
const tratamentoRepo = new TratamentoRepository();

export class TratamentoService {

    async buscarTratamentosPorPaciente(seqpaciente: number, sequsuario: number): Promise<ITratamentoDetalhado[]> {
        const pacienteExists = await pacienteRepo.buscarPacientePorSeq(seqpaciente, sequsuario);

        if (!pacienteExists) {
            throw new AppError(
                "Paciente não encontrado",
                404,
                "PACIENTE_NOT_FOUND"
            );
        }

        return await tratamentoRepo.buscarTratamentosPorPaciente(seqpaciente, sequsuario);
    }

    async criarTratamento(dados: ICriarTratamento, sequsuario: number): Promise<void> {
        const pacienteExists = await pacienteRepo.buscarPacientePorSeq(dados.seqpaciente, sequsuario);

        if (!pacienteExists) {
            throw new AppError(
                "Paciente não encontrado",
                404,
                "PACIENTE_NOT_FOUND"
            );
        }

        this.validarDatas(dados.data_inicio, dados.data_fim);
        this.validarRepeticao(dados);
        this.validarHorario(dados);
        this.validarItens(dados.itens);

        for (const item of dados.itens) {
            const medicamentoExists = await medicamentoRepo.buscarMedicamentoPorSeq(item.seqmedicamento, sequsuario);
            if (!medicamentoExists) {
                throw new AppError(
                    "Um dos medicamentos informados não foi encontrado.",
                    404,
                    "MEDICAMENTO_NOT_FOUND"
                );
            }
        }

        await tratamentoRepo.criarTratamento(dados);
    }

    async atualizarTratamento(dados: IEditarTratamento, sequsuario: number) {
        const pacienteExists = await pacienteRepo.buscarPacientePorSeq(dados.seqpaciente, sequsuario);
        const tratamentoExists = await tratamentoRepo.buscarTratamentoPorSeq(dados.seqtratamento, dados.seqpaciente, sequsuario);

        if (!pacienteExists) {
            throw new AppError(
                "Paciente não encontrado",
                404,
                "PACIENTE_NOT_FOUND"
            );
        }

        if (!tratamentoExists) {
            throw new AppError(
                "Tratamento não encontrado",
                404,
                "TRATAMENTO_NOT_FOUND"
            );
        }

        this.validarDatas(dados.data_inicio, dados.data_fim);
        this.validarRepeticao(dados);
        this.validarHorario(dados);
        this.validarItens(dados.itens);

        for (const item of dados.itens) {
            const medicamentoExists = await medicamentoRepo.buscarMedicamentoPorSeq(item.seqmedicamento, sequsuario);
            if (!medicamentoExists) {
                throw new AppError(
                    "Um dos medicamentos informados não foi encontrado.",
                    404,
                    "MEDICAMENTO_NOT_FOUND"
                );
            }
        }
        await tratamentoRepo.atualizarTratamento(dados);
    }

    async deletarTratamento(seqtratamento: number, seqpaciente: number, sequsuario: number) {
        const pacienteExists = await pacienteRepo.buscarPacientePorSeq(seqpaciente, sequsuario);
        const tratamentoExists = await tratamentoRepo.buscarTratamentoPorSeq(seqtratamento, seqpaciente, sequsuario);

        if (!pacienteExists) {
            throw new AppError(
                "Paciente não encontrado",
                404,
                "PACIENTE_NOT_FOUND"
            );
        }

        if (!tratamentoExists) {
            throw new AppError(
                "Tratamento não encontrado",
                404,
                "TRATAMENTO_NOT_FOUND"
            );
        }

        await tratamentoRepo.deletarTratamento(seqtratamento, seqpaciente);
    }

    private validarDatas(data_inicio: string, data_fim?: string | null): void {
        if (!this.dataIsoValida(data_inicio)) {
            throw new AppError(
                "Data de início inválida.",
                400,
                "INVALID_START_DATE"
            );
        }

        if (data_fim && !this.dataIsoValida(data_fim)) {
            throw new AppError(
                "Data de fim inválida.",
                400,
                "INVALID_END_DATE"
            );
        }

        if (data_fim && data_fim < data_inicio) {
            throw new AppError(
                "Data de fim não pode ser anterior à data de início.",
                400,
                "INVALID_DATE_RANGE"
            );
        }
    }

    private validarRepeticao(dados: ICriarTratamento): void {
        if (dados.tipo_repeticao === "A_CADA_DIAS" && (!Number.isInteger(dados.intervalo_dias) || dados.intervalo_dias <= 0)) {
            throw new AppError(
                "Informe um intervalo de dias válido para a repetição A_CADA_DIAS.",
                400,
                "INVALID_INTERVALO_DIAS"
            );
        }
    }

    private validarHorario(dados: ICriarTratamento): void {
        if (dados.tipo_horario === "EXATO") {
            if (!dados.horarios || dados.horarios.length === 0) {
                throw new AppError(
                    "Informe pelo menos um horário para o tratamento.",
                    400,
                    "EMPTY_SCHEDULE"
                );
            }

            const horariosUnicos = new Set(dados.horarios);

            if (horariosUnicos.size !== dados.horarios.length) {
                throw new AppError(
                    "Não informe horários repetidos.",
                    400,
                    "DUPLICATE_SCHEDULE"
                );
            }

            for (const horario of dados.horarios) {
                if (!this.horarioValido(horario)) {
                    throw new AppError(
                        "Um dos horários informados é inválido.",
                        400,
                        "INVALID_SCHEDULE"
                    );
                }
            }

            return;
        }

        if (!this.horarioValido(dados.horario_inicio)) {
            throw new AppError(
                "Informe um horário inicial válido.",
                400,
                "INVALID_START_TIME"
            );
        }

        if (
            !Number.isInteger(dados.intervalo_horas) ||
            dados.intervalo_horas <= 0
        ) {
            throw new AppError(
                "Informe um intervalo de horas válido.",
                400,
                "INVALID_HOUR_INTERVAL"
            );
        }
    }

    private validarItens(itens: ICriarTratamentoItem[]): void {
        if (!Array.isArray(itens) || itens.length === 0) {
            throw new AppError(
                "Adicione ao menos um medicamento ao tratamento.",
                400,
                "EMPTY_TREATMENT_ITEMS"
            );
        }

        const medicamentos = new Set<number>();

        for (const item of itens) {
            if (!Number.isInteger(item.seqmedicamento) || item.seqmedicamento <= 0) {
                throw new AppError(
                    "Medicamento inválido.",
                    400,
                    "INVALID_MEDICATION"
                );
            }

            if (medicamentos.has(item.seqmedicamento)) {
                throw new AppError(
                    "O mesmo medicamento não pode ser adicionado mais de uma vez ao tratamento.",
                    400,
                    "DUPLICATE_MEDICATION"
                );
            }
            medicamentos.add(item.seqmedicamento);

            if (!Number.isFinite(item.quantidade) || item.quantidade <= 0) {
                throw new AppError(
                    "A quantidade do medicamento deve ser maior que zero.",
                    400,
                    "INVALID_QUANTITY"
                );
            }

            if (!Number.isInteger(item.estoque) || item.estoque < 0) {
                throw new AppError(
                    "O estoque deve ser um número inteiro igual ou maior que zero.",
                    400,
                    "INVALID_STOCK"
                );
            }

            if (!item.unidade?.trim()) {
                throw new AppError(
                    "Informe a unidade do medicamento.",
                    400,
                    "INVALID_UNIT"
                );
            }
        }
    }

    private horarioValido(horario: unknown): boolean {
        if (typeof horario !== "string" || !/^\d{2}:\d{2}$/.test(horario)) {
            return false;
        }

        const [hora, minuto] = horario.split(':').map(Number);
        return hora >= 0 && hora <= 23 && minuto >= 0 && minuto <= 59;
    }

    private dataIsoValida(data: string): boolean {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
            return false;
        }

        const dataConvertida = new Date(`${data}T00:00:00.000Z`);

        return (
            !Number.isNaN(dataConvertida.getTime()) &&
            dataConvertida.toISOString().slice(0, 10) === data
        );
    }
}
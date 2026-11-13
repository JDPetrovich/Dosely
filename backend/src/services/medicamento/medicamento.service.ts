import { AppError } from "../../errors/app.error.js";
import type { ICriarMedicamento, IEditarMedicamento, IMedicamento } from "@dosely/shared";
import { MedicamentoRepository } from "../../repository/medicamento/medicamento.repository.js";

const medicamentoRepo = new MedicamentoRepository();

export class MedicamentoService {
    async buscarMedicamentos(sequsuario: number): Promise<IMedicamento[]> {
        const medicamentos = await medicamentoRepo.buscarMedicamentos(sequsuario);

        return medicamentos;
    }

    async criarMedicamento(medicamento: ICriarMedicamento) {
        const medicamentoExistentes = await medicamentoRepo.buscarMedicamentos(medicamento.sequsuario);

        const medicamentoExistente = medicamentoExistentes.some(
            (medicamentoExistente) =>
                medicamentoExistente.nome === medicamento.nome &&
                medicamentoExistente.descricao === medicamento.descricao &&
                medicamentoExistente.dosagem === medicamento.dosagem
        );

        if (medicamentoExistente) {
            throw new AppError(
                "Medicamento ja cadastrado",
                400,
                "MEDICAMENTO_ALREADY_EXISTS")
        }

        await medicamentoRepo.criarMedicamento(medicamento);
    }

    async atualizarMedicamento(medicamento: IEditarMedicamento) {
        const medicamentoExists = await medicamentoRepo.buscarMedicamentoPorSeq(medicamento.seqmedicamento, medicamento.sequsuario);

        if (!medicamentoExists) {
            throw new AppError(
                "Medicamento não encontrado",
                404,
                "MEDICAMENTO_NOT_FOUND"
            );
        }

        await medicamentoRepo.atualizarMedicamento(medicamento);
    }

    async deletarMedicamento(seqmedicamento: number, sequsuario: number) {
        const medicamentoExists = await medicamentoRepo.buscarMedicamentoPorSeq(seqmedicamento, sequsuario);

        if (!medicamentoExists) {
            throw new AppError(
                "Medicamento não encontrado",
                404,
                "MEDICAMENTO_NOT_FOUND"
            );
        }

        await medicamentoRepo.deletarMedicamento(seqmedicamento, sequsuario);
    }
}
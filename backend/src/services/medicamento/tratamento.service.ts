import { AppError } from "../../errors/app.error.js";
import { ICadastrarTratamento, IEditarTratamento } from "../../interfaces/medicamento/tratamento.interface.js";
import { MedicamentoRepository } from "../../repository/medicamento/medicamento.repository.js";
import { PacienteRepository } from "../../repository/paciente/paciente.repository.js";

const medicamentoRepo = new MedicamentoRepository();
const pacienteRepo = new PacienteRepository();

export class TratamentoService {

    async criarTratamento(medicamento: ICadastrarTratamento, sequsuario: number) {
        const pacienteExists = await pacienteRepo.buscarPacientePorSeq(medicamento.seqpaciente, sequsuario);

        if (!pacienteExists) {
            throw new AppError(
                "Paciente não encontrado",
                404,
                "PACIENTE_NOT_FOUND"
            );
        }

        const medicamentoExists = await medicamentoRepo.buscarMedicamentoPorSeq(medicamento.seqpaciente, medicamento.seqmedicamento);

        if (medicamentoExists) {
            throw new AppError(
                "Medicamento já vinculado ao paciente",
                400,
                "MEDICAMENTO_ALREADY_LINKED"
            );
        }


    }

    async atualizarTratamento(medicamento: IEditarTratamento, sequsuario: number) {
    }

    async deletarTratamento(seqmedicamento: number, seqpaciente: number) {

    }
}
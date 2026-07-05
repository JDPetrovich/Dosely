import { Request, Response } from "express";
import { MedicamentoPacienteRepository } from "../../repository/medicamento/medicamento-paciente.repository.js";

const medicamentoPacienteRepo = new MedicamentoPacienteRepository();

export const medicamentoPacienteController = {
    buscarTodos: async (req: Request, res: Response) => {
        try {
            const seqpaciente = req.params.id
            const medicamentos = await medicamentoPacienteRepo.buscarMedicamentos(Number(seqpaciente));
            res.status(200).json({ sucesso: true, dados: medicamentos });
        } catch (error) {
            res.status(500).json({
                sucesso: false,
                mensagem: (error as Error).message,
            });
        }
    }
};
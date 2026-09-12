import { Request, Response } from "express";
import { AlergiaPacienteRepository } from "../../repository/alergia/alergia-paciente.repository.js";

const alergiaPacienteRepo = new AlergiaPacienteRepository();

export class AlergiaPacienteController {
    async buscarTodos(req: Request, res: Response) {
        try {
            const seqpaciente = req.params.id
            const alergias = await alergiaPacienteRepo.buscarAlergias(Number(seqpaciente));
            res.status(200).json({ sucesso: true, dados: alergias });
        } catch (error) {
            res.status(500).json({
                sucesso: false,
                mensagem: (error as Error).message,
            });
        }
    }
};
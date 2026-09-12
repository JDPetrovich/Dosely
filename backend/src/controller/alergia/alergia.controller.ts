import { Request, Response } from "express";
import { AlergiaRepository } from "../../repository/alergia/alergia.repository.js";

const alergiaRepo = new AlergiaRepository();

export class AlergiaController {
    async buscarTodos(req: Request, res: Response) {
        try {
            const alergias = await alergiaRepo.buscarAlergias();
            res.status(200).json({ sucesso: true, dados: alergias });
        } catch (error) {
            res.status(500).json({
                sucesso: false,
                mensagem: (error as Error).message,
            });
        }
    }
};
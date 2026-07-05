import { Request, Response } from "express";
import { MedicamentoRepository } from "../../repository/medicamento/medicamento.repository.js";

const medicamentoRepo = new MedicamentoRepository();

export const medicamentoController = {
    buscarTodos: async (req: Request, res: Response) => {
        try {
            const medicamentos = await medicamentoRepo.buscarMedicamentos();
            res.status(200).json({ sucesso: true, dados: medicamentos });
        } catch (error) {
            res.status(500).json({
                sucesso: false,
                mensagem: (error as Error).message,
            });
        }
    }
};
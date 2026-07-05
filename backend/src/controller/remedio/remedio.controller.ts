import { Request, Response } from "express";
import { RemedioService } from "../../services/remedio/remedio.service.js";

const remedioService = new RemedioService();

export class RemedioController {
    async retornarRemedios(req: Request, res: Response) {
        try {
            const resultado = await remedioService.retornarRemedios();

            res.status(200).json({
                sucesso: true,
                dados: resultado
            });
        } catch (error: any) {
            return res.status(error.statusCode || 500).json({
                sucesso: false,
                mensagem: error.message || "Erro ao buscar remédios",
            });
        }
    }
};
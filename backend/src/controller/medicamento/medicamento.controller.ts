import { Request, Response } from "express";
import { MedicamentoService } from "../../services/medicamento/medicamento.service.js";
import { AppError } from "../../errors/app.error.js";
import type { ICriarMedicamento, IEditarMedicamento, IMedicamentobody } from "@dosely/shared";

const medicamentoService = new MedicamentoService();

interface MedicamentoParams {
    seqmedicamento: string;
}

export class MedicamentoController {
    async buscarMedicamentos(req: Request, res: Response) {
        const usuario = req.usuario;

        if (!usuario) {
            throw new AppError(
                "Usuário não autenticado",
                401,
                "UNAUTHENTICATED"
            )
        }

        const medicamentos = await medicamentoService.buscarMedicamentos(usuario.id);
        res.status(200).json({ sucesso: true, dados: medicamentos });
    }

    async criarMedicamento(req: Request<{}, {}, IMedicamentobody>, res: Response) {
        const usuario = req.usuario;

        if (!usuario) {
            throw new AppError(
                "Usuário não autenticado",
                401,
                "UNAUTHENTICATED"
            )
        }

        const dados: ICriarMedicamento = {
            ...req.body,
            sequsuario: usuario.id
        }

        await medicamentoService.criarMedicamento(dados);
        res.status(201).json({
            sucesso: true,
            mensagem: "Medicamento criado com sucesso!"
        });
    }

    async atualizarMedicamento(req: Request<MedicamentoParams, {}, IMedicamentobody>, res: Response) {
        const seqmedicamento = Number(req.params.seqmedicamento);
        const usuario = req.usuario;

        if (!usuario) {
            throw new AppError(
                "Usuário não autenticado",
                401,
                "UNAUTHENTICATED"
            )
        }

        if (!Number.isInteger(seqmedicamento) || seqmedicamento <= 0) {
            throw new AppError(
                "Medicamento não fornecido",
                404,
                "MEDICAMENTO_NOT_FOUND"
            )
        }

        const dados: IEditarMedicamento = {
            ...req.body,
            seqmedicamento,
            sequsuario: usuario.id
        }

        await medicamentoService.atualizarMedicamento(dados);
        res.status(200).json({
            sucesso: true,
            mensagem: "Medicamento atualizado com sucesso!"
        });
    }

    async deletarMedicamento(req: Request<MedicamentoParams>, res: Response) {
        const seqmedicamento = Number(req.params.seqmedicamento);
        const usuario = req.usuario;

        if (!usuario) {
            throw new AppError(
                "Usuário não autenticado",
                401,
                "UNAUTHENTICATED"
            )
        }

        if (!Number.isInteger(seqmedicamento) || seqmedicamento <= 0) {
            throw new AppError(
                "Medicamento não fornecido",
                404,
                "MEDICAMENTO_NOT_FOUND"
            )
        }

        await medicamentoService.deletarMedicamento(seqmedicamento, usuario.id);
        res.status(200).json({
            sucesso: true,
            mensagem: "Medicamento deletado com sucesso!"
        });
    }
};
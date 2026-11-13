import { Request, Response } from "express";
import { AlergiaService } from "../../services/alergia/alergia.service.js";
import { AppError } from "../../errors/app.error.js";
import type { IAlergiaBody } from "@dosely/shared";

const alergiaService = new AlergiaService();

interface AlergiaParams {
    seqalergia: string;
}

export class AlergiaController {
    async buscarTodos(req: Request, res: Response) {
        const usuario = req.usuario;

        if (!usuario) {
            throw new AppError("Usuário não autenticado", 401, "UNAUTHENTICATED");
        }

        const alergias = await alergiaService.buscarAlergias(usuario.id);
        res.status(200).json({ sucesso: true, dados: alergias });
    }

    async criar(req: Request<{}, {}, IAlergiaBody>, res: Response) {
        const usuario = req.usuario;

        if (!usuario) {
            throw new AppError("Usuário não autenticado", 401, "UNAUTHENTICATED");
        }

        await alergiaService.criarAlergia(req.body.descricao, usuario.id);
        res.status(201).json({
            sucesso: true,
            mensagem: "Alergia criada com sucesso!"
        });
    }

    async atualizar(req: Request<AlergiaParams, {}, IAlergiaBody>, res: Response) {
        const seqalergia = Number(req.params.seqalergia);
        const usuario = req.usuario;

        if (!usuario) {
            throw new AppError("Usuário não autenticado", 401, "UNAUTHENTICATED");
        }

        if (!Number.isInteger(seqalergia) || seqalergia <= 0) {
            throw new AppError("Alergia não fornecida", 404, "ALERGIA_NOT_FOUND");
        }

        await alergiaService.atualizarAlergia(seqalergia, req.body.descricao, usuario.id);
        res.status(200).json({
            sucesso: true,
            mensagem: "Alergia atualizada com sucesso!"
        });
    }

    async deletar(req: Request<AlergiaParams>, res: Response) {
        const seqalergia = Number(req.params.seqalergia);
        const usuario = req.usuario;

        if (!usuario) {
            throw new AppError("Usuário não autenticado", 401, "UNAUTHENTICATED");
        }

        if (!Number.isInteger(seqalergia) || seqalergia <= 0) {
            throw new AppError("Alergia não fornecida", 404, "ALERGIA_NOT_FOUND");
        }

        await alergiaService.deletarAlergia(seqalergia, usuario.id);
        res.status(200).json({
            sucesso: true,
            mensagem: "Alergia deletada com sucesso!"
        });
    }
}
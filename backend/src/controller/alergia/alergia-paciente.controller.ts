import { Request, Response } from "express";
import { AlergiaService } from "../../services/alergia/alergia.service.js";
import { AppError } from "../../errors/app.error.js";
import type { IAssociarAlergiaBody } from "@dosely/shared";

const alergiaService = new AlergiaService();

interface AlergiaPacienteParams {
    seqpaciente: string;
    seqalergia?: string;
}

export class AlergiaPacienteController {
    async buscarTodos(req: Request<AlergiaPacienteParams>, res: Response) {
        const seqpaciente = Number(req.params.seqpaciente);
        const usuario = req.usuario;

        if (!usuario) {
            throw new AppError("Usuário não autenticado", 401, "UNAUTHENTICATED");
        }

        const alergias = await alergiaService.buscarAlergiasPaciente(seqpaciente, usuario.id);
        res.status(200).json({ sucesso: true, dados: alergias });
    }

    async associar(req: Request<AlergiaPacienteParams, {}, IAssociarAlergiaBody>, res: Response) {
        const seqpaciente = Number(req.params.seqpaciente);
        const usuario = req.usuario;

        if (!usuario) {
            throw new AppError("Usuário não autenticado", 401, "UNAUTHENTICATED");
        }

        await alergiaService.associarAlergia(seqpaciente, req.body.seqalergia, usuario.id);
        res.status(201).json({
            sucesso: true,
            mensagem: "Alergia associada ao paciente com sucesso!"
        });
    }

    async desassociar(req: Request<AlergiaPacienteParams>, res: Response) {
        const seqpaciente = Number(req.params.seqpaciente);
        const seqalergia = Number(req.params.seqalergia);
        const usuario = req.usuario;

        if (!usuario) {
            throw new AppError("Usuário não autenticado", 401, "UNAUTHENTICATED");
        }

        if (!Number.isInteger(seqalergia) || seqalergia <= 0) {
            throw new AppError("Alergia não fornecida", 404, "ALERGIA_NOT_FOUND");
        }

        await alergiaService.desassociarAlergia(seqpaciente, seqalergia, usuario.id);
        res.status(200).json({
            sucesso: true,
            mensagem: "Alergia removida do paciente com sucesso!"
        });
    }
}
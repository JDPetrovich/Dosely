import { Request, Response } from "express";
import { TratamentoService } from "../../services/tratamento/tratamento.service.js";
import type { ICriarTratamento, IEditarTratamento, ITratamentoBody } from "@dosely/shared";
import { AppError } from "../../errors/app.error.js";

const tratamentoService = new TratamentoService();

interface TratamentoParams {
    seqpaciente: string;
    seqtratamento?: string;
}

export class TratamentoController {
    async buscarTratamento(req: Request<TratamentoParams>, res: Response) {
        const seqpaciente = Number(req.params.seqpaciente);
        const usuario = req.usuario;

        if (!usuario) {
            throw new AppError(
                "Usuário não autenticado",
                401,
                "UNAUTHENTICATED"
            )
        }

        if (!Number.isInteger(seqpaciente) || seqpaciente <= 0) {
            throw new AppError(
                "O identificador do paciente é inválido.",
                400,
                "INVALID_PATIENT_ID"
            )
        }

        const tratamentos = await tratamentoService.buscarTratamentosPorPaciente(seqpaciente, usuario.id);
        res.status(200).json({
            sucesso: true,
            dados: tratamentos
        });
    }

    async criarTratamento(req: Request<TratamentoParams, {}, ITratamentoBody>, res: Response) {
        const seqpaciente = Number(req.params.seqpaciente);
        const usuario = req.usuario;

        if (!usuario) {
            throw new AppError(
                "Usuário não autenticado",
                401,
                "UNAUTHENTICATED"
            )
        }

        if (!Number.isInteger(seqpaciente) || seqpaciente <= 0) {
            throw new AppError(
                "O identificador do paciente é inválido.",
                400,
                "INVALID_PATIENT_ID"
            )
        }

        const dados: ICriarTratamento = {
            ...req.body,
            seqpaciente
        };

        await tratamentoService.criarTratamento(dados, usuario.id);
        res.status(201).json({
            sucesso: true,
            mensagem: "Tratamento criado com sucesso!"
        });
    }

    async atualizarTratamento(req: Request<TratamentoParams, {}, ITratamentoBody>, res: Response) {
        const seqpaciente = Number(req.params.seqpaciente);
        const seqtratamento = Number(req.params.seqtratamento);
        const usuario = req.usuario;

        if (!usuario) {
            throw new AppError(
                "Usuário não autenticado",
                401,
                "UNAUTHENTICATED"
            );
        }

        if (!Number.isInteger(seqpaciente) || seqpaciente <= 0) {
            throw new AppError(
                "O identificador do paciente é inválido.",
                400,
                "INVALID_PATIENT_ID"
            );
        }

        if (!Number.isInteger(seqtratamento) || seqtratamento <= 0) {
            throw new AppError(
                "O identificador do tratamento é inválido.",
                400,
                "INVALID_TREATMENT_ID"
            );
        }

        const dados: IEditarTratamento = {
            ...req.body,
            seqpaciente,
            seqtratamento
        };

        await tratamentoService.atualizarTratamento(dados, usuario.id);
        res.status(200).json({
            sucesso: true,
            mensagem: "Tratamento atualizado com sucesso!"
        });
    }

    async deletarTratamento(req: Request<TratamentoParams>, res: Response) {
        const seqpaciente = Number(req.params.seqpaciente);
        const seqtratamento = Number(req.params.seqtratamento);
        const usuario = req.usuario;


        if (!usuario) {
            throw new AppError(
                "Usuário não autenticado",
                401,
                "UNAUTHENTICATED"
            );
        }

        if (!Number.isInteger(seqpaciente) || seqpaciente <= 0) {
            throw new AppError(
                "O identificador do paciente é inválido.",
                400,
                "INVALID_PATIENT_ID"
            );
        }

        if (!Number.isInteger(seqtratamento) || seqtratamento <= 0) {
            throw new AppError(
                "O identificador do tratamento é inválido.",
                400,
                "INVALID_TREATMENT_ID"
            );
        }

        await tratamentoService.deletarTratamento(seqtratamento, seqpaciente, usuario.id);
        res.status(200).json({
            sucesso: true,
            mensagem: "Tratamento deletado com sucesso!"
        });
    }
};
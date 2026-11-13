import { Request, Response } from "express";
import { PacienteService } from "../../services/paciente/paciente.service.js";
import { AppError } from "../../errors/app.error.js";
import type { ICriarPaciente, IEditarPaciente, IPacienteBody } from "@dosely/shared";

const pacienteService = new PacienteService();

interface PacienteParams {
    seqpaciente: string;
}

export class PacienteController {
    async buscarTodosPacientes(req: Request, res: Response) {
        const usuario = req.usuario

        if (!usuario) {
            throw new AppError(
                "Usuário não autenticado",
                401,
                "UNAUTHENTICATED"
            )
        }

        const pacientes = await pacienteService.buscarPacientes(usuario.id);
        res.status(200).json({ sucesso: true, dados: pacientes });
    }

    async criarPaciente(req: Request<{}, {}, IPacienteBody>, res: Response) {
        const usuario = req.usuario

        if (!usuario) {
            throw new AppError(
                "Usuário não autenticado",
                401,
                "UNAUTHENTICATED"
            )
        }

        const dados: ICriarPaciente = {
            ...req.body,
            sequsuario: usuario.id
        }

        await pacienteService.criarPaciente(dados);
        res.status(201).json({
            sucesso: true,
            mensagem: "Paciente criado com sucesso!",
        });

    }

    async atualizarPaciente(req: Request<PacienteParams, {}, IPacienteBody>, res: Response) {
        const seqpaciente = Number(req.params.seqpaciente);
        const usuario = req.usuario

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
            );
        }

        const dados: IEditarPaciente = {
            ...req.body,
            sequsuario: usuario.id,
            seqpaciente
        }

        await pacienteService.atualizarPaciente(dados);
        res.status(200).json({
            sucesso: true,
            mensagem: "Paciente atualizado com sucesso!",
        });

    }

    async deletarPaciente(req: Request<PacienteParams>, res: Response) {
        try {
            const seqpaciente = Number(req.params.seqpaciente);
            const usuario = req.usuario;

            if (!usuario) {
                throw new AppError(
                    "Usuário não autenticado.",
                    401,
                    "UNAUTHENTICATED"
                )
            }

            if (!Number.isInteger(seqpaciente) || seqpaciente <= 0) {
                throw new AppError(
                    "O identificador do paciente é inválido.",
                    400,
                    "INVALID_PATIENT_ID"
                );
            }

            await pacienteService.deletarPaciente(usuario.id, seqpaciente);

            res.status(200).json({
                sucesso: true,
                mensagem: "Paciente deletado com sucesso!",
            });
        } catch (error) {
            res.status(500).json({
                sucesso: false,
                mensagem: (error as Error).message,
            });
        }
    }
};
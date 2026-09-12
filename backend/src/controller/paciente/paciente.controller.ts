import { Request, Response } from "express";
import { PacienteService } from "../../services/paciente/paciente.service.js";
import { AppError } from "../../errors/app.error.js";
import { ICadastrarPaciente, IEditarPaciente } from "../../interfaces/paciente/paciente.interface.js";

const pacienteService = new PacienteService();
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

    async criarPaciente(req: Request, res: Response) {
        const { nome, data_nascimento, login, senha, cpf, telefone, email } = req.body
        const sequsuario = req.usuario

        if (!sequsuario) {
            throw new AppError(
                "Usuário não autenticado",
                401,
                "UNAUTHENTICATED"
            )
        }

        if (!nome || !data_nascimento || !login || !senha || !cpf || !telefone || !email) {
            throw new AppError(
                "Campo obrigatório não preenchido.",
                400,
                "INVALID_DATA"
            )
        }

        const dados: ICadastrarPaciente = {
            sequsuario: sequsuario.id,
            nome,
            data_nascimento,
            login,
            senha,
            cpf,
            telefone,
            email
        }

        await pacienteService.criarPaciente(dados);
        res.status(201).json({
            sucesso: true,
            mensagem: "Paciente criado com sucesso!",
        });

    }

    async atualizarPaciente(req: Request, res: Response) {
        const { nome, data_nascimento, login, senha, cpf, telefone, email } = req.body
        const seqpaciente = Number(req.params.id)
        const sequsuario = req.usuario

        if (!sequsuario) {
            throw new AppError(
                "Usuário não autenticado",
                401,
                "UNAUTHENTICATED"
            )
        }

        if (!seqpaciente) {
            throw new AppError(
                "Paciente não encontrado",
                404,
                "PACIENTE_NOT_FOUND"
            )
        }

        if (!nome || !data_nascimento || !login || !senha || !cpf || !telefone || !email) {
            throw new AppError(
                "Campo obrigatório não preenchido.",
                400,
                "INVALID_DATA"
            )
        }

        const dados: IEditarPaciente = {
            sequsuario: sequsuario.id,
            seqpaciente,
            nome,
            data_nascimento,
            login,
            senha,
            cpf,
            telefone,
            email
        }

        await pacienteService.atualizarPaciente(dados);
        res.status(200).json({
            sucesso: true,
            mensagem: "Paciente atualizado com sucesso!",
        });

    }

    async deletarPaciente(req: Request, res: Response) {
        try {
            const seqpaciente = Number(req.params.id)
            const sequsuario = req.usuario;

            if (!sequsuario) {
                throw new AppError(
                    "Usuário não autenticado.",
                    401,
                    "UNAUTHENTICATED"
                )
            }

            if (!seqpaciente) {
                throw new AppError(
                    "Paciente não fornecido.",
                    404,
                    "PACIENTE_NOT_FOUND"
                )
            }

            await pacienteService.deletarPaciente(sequsuario.id, seqpaciente);

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
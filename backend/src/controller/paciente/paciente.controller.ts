import { Request, Response } from "express";
import { PacienteRepository } from "../../repository/paciente/paciente.repository.js";

const pacienteRepo = new PacienteRepository();

export const pacienteController = {
    buscarTodos: async (req: Request, res: Response) => {
        try {
            const pacientes = await pacienteRepo.buscarPacientes();
            res.status(200).json({ sucesso: true, dados: pacientes });
        } catch (error) {
            res.status(500).json({
                sucesso: false,
                mensagem: (error as Error).message,
            });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            await pacienteRepo.criarPaciente(req.body);
            res.status(201).json({
                sucesso: true,
                mensagem: "Paciente criado com sucesso!",
            });
        } catch (error) {
            res.status(500).json({
                sucesso: false,
                mensagem: (error as Error).message,
            });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            await pacienteRepo.atualizarPaciente(req.body);
            res.status(200).json({
                sucesso: true,
                mensagem: "Paciente atualizado com sucesso!",
            });
        } catch (error) {
            res.status(500).json({
                sucesso: false,
                mensagem: (error as Error).message,
            });
        }
    },

    deletar: async (req: Request, res: Response) => {
        try {
            let seqpaciente = req.params.id
            let codpaciente = req.body.codpaciente

            await pacienteRepo.deletarPaciente(Number(seqpaciente), codpaciente);

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
    },
};
import { Request, Response } from "express";
import { TarefaRepository } from "../../repository/tarefa/tarefa.repository.js";

const tarefaRepo = new TarefaRepository();

export const tarefaController = {
    buscarTodos: async (req: Request, res: Response) => {
        try {
            const tarefas = await tarefaRepo.buscarTarefas();
            res.status(200).json({ sucesso: true, dados: tarefas });
        } catch (error) {
            res.status(500).json({
                sucesso: false,
                mensagem: (error as Error).message,
            });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            let descricao = req.body.descricao
            await tarefaRepo.criarTarefa(descricao);
            res.status(201).json({
                sucesso: true,
                mensagem: "Tarefa criada com sucesso!",
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
            let seqtarefa = req.params.id
            let descricao = req.body.descricao

            await tarefaRepo.atualizarTarefa(Number(seqtarefa), descricao);
            res.status(200).json({
                sucesso: true,
                mensagem: "Tarefa atualizada com sucesso!",
            });
        } catch (error) {
            res.status(500).json({
                sucesso: false,
                mensagem: (error as Error).message,
            });
        }
    },

    concluir: async (req: Request, res: Response) => {
        try {
            let seqtarefa = req.params.id
            let concluido = req.body.concluido

            await tarefaRepo.concluirTarefa(Number(seqtarefa), concluido);
            res.status(200).json({
                sucesso: true,
                mensagem: "Tarefa concluida com sucesso!",
            });
        } catch (error) {
            res.status(500).json({
                sucesso: false,
                mensagem: (error as Error).message,
            });
        }
    },
};
import { Request, Response } from "express";
import { MedicamentoService } from "../../services/medicamento/medicamento.service.js";
import { AppError } from "../../errors/app.error.js";
import { ICadastrarMedicamento, IEditarMedicamento } from "../../interfaces/medicamento/medicamento.interface.js";

const medicamentoService = new MedicamentoService();

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

    async criarMedicamento(req: Request, res: Response) {
        const { nome, descricao, dosagem } = req.body;
        const usuario = req.usuario;

        if (!usuario) {
            throw new AppError(
                "Usuário não autenticado",
                401,
                "UNAUTHENTICATED"
            )
        }

        if (!nome || !descricao || !dosagem) {
            throw new AppError(
                "Campo obrigatório não preenchido.",
                400,
                "INVALID_DATA"
            )
        }

        const dados: ICadastrarMedicamento = {
            sequsuario: usuario.id,
            nome,
            descricao,
            dosagem,
        }

        await medicamentoService.criarMedicamento(dados);
        res.status(201).json({
            sucesso: true,
            mensagem: "Medicamento criado com sucesso!"
        });
    }

    async atualizarMedicamento(req: Request, res: Response) {
        const { seqmedicamento } = req.params;
        const { nome, descricao, dosagem } = req.body;
        const usuario = req.usuario;

        if (!usuario) {
            throw new AppError(
                "Usuário não autenticado",
                401,
                "UNAUTHENTICATED"
            )
        }

        if (!seqmedicamento) {
            throw new AppError(
                "Medicamento não fornecido",
                404,
                "MEDICAMENTO_NOT_FOUND"
            )
        }

        if (!nome || !descricao || !dosagem) {
            throw new AppError(
                "Campo obrigatório não preenchido.",
                400,
                "INVALID_DATA"
            )
        }

        const dados: IEditarMedicamento = {
            seqmedicamento: Number(seqmedicamento),
            sequsuario: usuario.id,
            nome,
            descricao,
            dosagem,
        }

        await medicamentoService.atualizarMedicamento(dados);
        res.status(200).json({
            sucesso: true,
            mensagem: "Medicamento atualizado com sucesso!"
        });
    }

    async deletarMedicamento(req: Request, res: Response) {
        const { seqmedicamento } = req.params;
        const usuario = req.usuario;

        if (!usuario) {
            throw new AppError(
                "Usuário não autenticado",
                401,
                "UNAUTHENTICATED"
            )
        }

        if (!seqmedicamento) {
            throw new AppError(
                "Medicamento não fornecido",
                404,
                "MEDICAMENTO_NOT_FOUND"
            )
        }

        await medicamentoService.deletarMedicamento(Number(seqmedicamento), usuario.id);
        res.status(200).json({
            sucesso: true,
            mensagem: "Medicamento deletado com sucesso!"
        });
    }
};
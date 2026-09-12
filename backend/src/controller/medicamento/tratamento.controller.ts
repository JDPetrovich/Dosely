import { Request, Response } from "express";
import { TratamentoService } from "../../services/medicamento/tratamento.service.js";
import { ICriarTratamento, ICriarTratamentoBody } from "../../interfaces/medicamento/tratamento.interface.js";
import { AppError } from "../../errors/app.error.js";

const tratamentoService = new TratamentoService();

interface TratamentoParams {
    seqpaciente: string;
}

export class TratamentoController {
    async criarTratamento(
        req: Request<TratamentoParams, {}, ICriarTratamentoBody>,
        res: Response
    ) {
        const seqpaciente = Number(req.params.seqpaciente);
        const usuario = req.usuario;

        if (!usuario) {
            throw new AppError(
                "Usuário não autenticado",
                401,
                "UNAUTHENTICATED"
            )
        }

        if (!seqpaciente) {
            throw new AppError(
                "Campo obrigatório não preenchido.",
                400,
                "INVALID_DATA"
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

    async atualizarTratamento(req: Request, res: Response) { }

    async deletarTratamento(req: Request, res: Response) { }
};
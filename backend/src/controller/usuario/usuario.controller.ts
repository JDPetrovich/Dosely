import { Request, Response } from "express";
import { AuthService } from "../../services/auth/auth.service.js";
import { UsuarioService } from "../../services/usuario/usuario.service.js";
import { AppError } from "../../errors/index.js";

const authService = new AuthService();
const usuarioService = new UsuarioService();

export class UsuarioController {
    async login(req: Request, res: Response) {
        const { login, senha } = req.body;

        if (!login || !senha) {
            throw new AppError(
                "Campo obrigatório não preenchido.",
                400,
                "INVALID_DATA"
            );
        }

        const resultado = await authService.login({ login, senha });

        return res.status(200).json({
            sucesso: true,
            dados: resultado,
        });
    }

    async criarUsuario(req: Request, res: Response) {
        const { nome, email, login, senha } = req.body;

        if (!nome || !email || !login || !senha) {
            throw new AppError(
                "Campo obrigatório não preenchido.",
                400,
                "INVALID_DATA"
            );
        }
        await usuarioService.criarUsuario({ nome, email, login, senha });

        return res.status(201).json({
            sucesso: true,
            mensagem: "Usuário criado com sucesso",
        });
    }
};
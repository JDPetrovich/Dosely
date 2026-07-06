import { Request, Response } from "express";
import { AuthService } from "../../services/auth/auth.service.js";
import { UsuarioService } from "../../services/usuario/usuario.service.js";
import { AppError, MensagemErro, DatabaseErrorHandler } from "../../errors/index.js";

const authService = new AuthService();
const usuarioService = new UsuarioService();

export class UsuarioController {
    async login(req: Request, res: Response) {
        try {
            const { login, senha } = req.body;

            if (!login || !senha) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "Login e senha são obrigatórios",
                });
            }

            const resultado = await authService.login({ login, senha });

            return res.status(200).json({
                sucesso: true,
                dados: resultado,
            });

        } catch (error: any) {
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({
                sucesso: false,
                mensagem: error.mensagem,
            });
        }
    }

    async criarUsuario(req: Request, res: Response) {
        try {
            const { nome, email, login, senha } = req.body;

            if (!nome || !email || !login || !senha) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "Dados não preenchidos corretamente",
                });
            }
            await usuarioService.criarUsuario({ nome, email, login, senha });

            return res.status(201).json({
                sucesso: true,
                mensagem: "Usuário criado com sucesso",
            });
        }
        catch (error: any) {
            return res.status(500).json({
                sucesso: false,
                mensagem: error.mensagem,
            });
        }
    }
};
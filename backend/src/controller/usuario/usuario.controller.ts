import { Request, Response } from "express";
import { AuthService } from "../../services/auth/auth.service.js";
import { UsuarioRepository } from "../../repository/usuario/usuario.repository.js";
import { AppError, MensagemErro, DatabaseErrorHandler } from "../../errors/index.js";

const authService = new AuthService();
const usuarioRepo = new UsuarioRepository();

export const usuarioController = {
    login: async (req: Request, res: Response) => {
        try {
            const { login, senha } = req.body;

            if (!login || !senha) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "Login e senha são obrigatórios",
                });
            }

            const resultado = await authService.login(login, senha);

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
    },

    criar: async (req: Request, res: Response) => {
        try {
            const { login, senha, nome } = req.body;

            if (!login || !senha || !nome) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "Login, senha e nome são obrigatórios",
                });
            }
            const id = await usuarioRepo.criarUsuario(login, senha, nome);

            return res.status(201).json({
                sucesso: true,
                dados: { sequsuario: id, login, nome },
            });
        }
        catch (error: any) {
            return res.status(500).json({
                sucesso: false,
                mensagem: error.mensagem,
            });
        }
    },

    me: (req: Request, res: Response) => {
        return res.status(200).json({
            sucesso: true
        });
    }
};
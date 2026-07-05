import { Request, Response } from "express";
import { AuthService } from "../../services/auth/auth.service.js";

const authService = new AuthService();

export class AuthController {
    async refresh(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "Refresh token não enviado",
                });
            }

            const result = await authService.refresh(refreshToken);

            return res.status(200).json({
                sucesso: true,
                dados: result,
            });

        } catch (error: any) {
            return res.status(401).json({
                sucesso: false,
                mensagem: error.message,
            });
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "Refresh token não enviado",
                });
            }

            await authService.logout(refreshToken);

            return res.status(200).json({
                sucesso: true,
            });

        } catch (error: any) {
            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro interno",
            });
        }
    }

    async me(req: Request, res: Response) {
        try {
            const reqUsuario = req.usuario;

            if (!reqUsuario) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "Usuário nao autenticado",
                });
            }

            const resultado = await authService.validarAcesso(reqUsuario.id);

            return res.status(200).json({
                sucesso: true,
                dados: resultado
            });
        } catch (error) {

        }
    }
}
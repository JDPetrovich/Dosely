import { TokenService } from "../token/token.service.js";
import { UsuarioRepository } from "../../repository/usuario/usuario.repository.js";
import { UsuarioRefreshRepository } from "../../repository/usuario/usuario-refresh.repository.js";
import { UsuarioService } from "../usuario/usuario.service.js";
import { ILogin, ITelaUsuario } from "../../interfaces/usuario/usuario.interface.js";
import { AppError, MensagemErro, DatabaseErrorHandler } from "../../errors/index.js";

const tokenService = new TokenService();
const usuarioService = new UsuarioService();
const usuarioRepo = new UsuarioRepository();
const refreshRepo = new UsuarioRefreshRepository();

export class AuthService {
    async login(dados: ILogin) {
        const { login, senha } = dados;
        const usuario = await usuarioRepo.buscarPorLogin(login);

        if (!usuario) {
            throw {
                statusCode: 401,
                mensagem: "Usuário ou senha inválidos"
            };
        }

        const senhaFake = "$2b$10$1234567890123456789012uJ8y5v5v5v5v5v5v5v5v5v5v5";
        const hash = usuario.senha || senhaFake;

        const senhaValida = await usuarioRepo.validarSenha(senha, hash);

        const loginInvalido = !usuario || !senhaValida;

        if (loginInvalido && usuario) {
            let { loginAttempts, failedBlocks, lockUntil } = usuario;
            let novoStatus: 'active' | 'locked' = usuario.status;

            loginAttempts += 1;

            if (loginAttempts >= 5) {
                failedBlocks += 1;
                loginAttempts = 0;

                if (failedBlocks === 1) {
                    lockUntil = Date.now() + 15 * 60 * 1000;
                } else if (failedBlocks === 2) {
                    lockUntil = Date.now() + 6 * 60 * 60 * 1000;
                } else if (failedBlocks >= 3) {
                    novoStatus = 'locked';
                    lockUntil = null;
                }
            }

            await usuarioRepo.atualizarTentativas(usuario.sequsuario, {
                loginAttempts,
                failedBlocks,
                lockUntil,
                status: novoStatus,
            });
        }

        if (usuario) {
            if (usuario.status === 'locked') {
                throw {
                    statusCode: 403,
                    mensagem: "Conta bloqueada permanentemente. Contate o administrador.",
                };
            }

            const lockUntil = usuario.lockUntil ? Number(usuario.lockUntil) : null;

            if (lockUntil && lockUntil > Date.now()) {
                const minutosRestantes = Math.ceil((lockUntil - Date.now()) / 60000);

                throw {
                    statusCode: 403,
                    mensagem: `Tente novamente em ${minutosRestantes} minuto(s).`,
                };
            }
        }

        if (loginInvalido) {
            throw {
                statusCode: 401,
                mensagem: "Usuário ou senha inválidos",
            };
        }

        await usuarioRepo.atualizarTentativas(usuario.sequsuario, {
            loginAttempts: 0,
            failedBlocks: 0,
            lockUntil: null,
            status: 'active',
        });

        const accessToken = tokenService.gerarAccessToken({
            id: usuario.sequsuario,
            nome: usuario.nome,
        });

        const { token: refreshToken, expiraEm } =
            tokenService.gerarRefreshToken({
                id: usuario.sequsuario,
                nome: usuario.nome,
            });

        await refreshRepo.salvar(usuario.sequsuario, refreshToken, expiraEm);

        return {
            sequsuario: usuario.sequsuario,
            nome: usuario.nome,
            accessToken,
            refreshToken,
        };
    }

    async refresh(token: string) {
        try {
            const decoded = tokenService.verificarRefreshToken(token) as any;
            const tokenSalvo = await refreshRepo.buscar(token);

            if (!tokenSalvo || tokenSalvo.revogado) {
                throw new Error("Refresh token inválido");
            }

            if (tokenSalvo.expira_em < Math.floor(Date.now() / 1000)) {
                throw new Error("Refresh token expirado");
            }

            await refreshRepo.revogar(token);

            const newAccessToken = tokenService.gerarAccessToken({
                id: decoded.id,
                nome: decoded.nome,
            });

            const { token: newRefreshToken, expiraEm } =
                tokenService.gerarRefreshToken({
                    id: decoded.id,
                    nome: decoded.nome,
                });

            await refreshRepo.salvar(decoded.id, newRefreshToken, expiraEm);

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };

        } catch (error: any) {
            throw error;
        }
    }

    async validarAcesso(sequsuario: number): Promise<ITelaUsuario> {
        const usuario = await usuarioService.buscarUsuarioPorSeq(sequsuario);

        if (!usuario) {
            throw {
                statusCode: 404,
                mensagem: "Usuário não encontrado."
            };
        }

        return {
            sequsuario: usuario.sequsuario,
            nome: usuario.nome,
            email: usuario.email,
        } as ITelaUsuario;
    }

    async logout(refreshToken: string): Promise<void> {
        await refreshRepo.revogar(refreshToken);
    }
}
import { TokenService } from "../token/token.service.js";
import { UsuarioRepository } from "../../repository/usuario/usuario.repository.js";
import { UsuarioRefreshRepository } from "../../repository/usuario/usuario-refresh.repository.js";
import { UsuarioService } from "../usuario/usuario.service.js";
import { ILogin, ITelaUsuario } from "../../interfaces/usuario/usuario.interface.js";
import { AppError } from "../../errors/app.error.js";

const tokenService = new TokenService();
const usuarioService = new UsuarioService();
const usuarioRepo = new UsuarioRepository();
const refreshRepo = new UsuarioRefreshRepository();

export class AuthService {
    async login(dados: ILogin) {
        const { login, senha } = dados;
        const usuario = await usuarioRepo.buscarPorLogin(login);

        if (!usuario) {
            throw new AppError(
                "Usuário ou senha inválidos.",
                401,
                "INVALID_CREDENTIALS"
            );
        }

        const senhaFake =
            "$2b$10$1234567890123456789012uJ8y5v5v5v5v5v5v5v5v5v5v5";

        const hash = usuario.senha || senhaFake;

        const senhaValida = await usuarioRepo.validarSenha(senha, hash);

        const loginInvalido = !senhaValida;

        if (loginInvalido) {
            let { tentativas_login, nivel_bloqueio, bloqueado_ate } = usuario;
            let novoStatus: "active" | "locked" = usuario.status;

            tentativas_login++;

            if (tentativas_login >= 5) {
                nivel_bloqueio++;
                tentativas_login = 0;

                if (nivel_bloqueio === 1) {
                    bloqueado_ate = Date.now() + 15 * 60 * 1000;
                } else if (nivel_bloqueio === 2) {
                    bloqueado_ate = Date.now() + 6 * 60 * 60 * 1000;
                } else if (nivel_bloqueio >= 3) {
                    novoStatus = "locked";
                    bloqueado_ate = null;
                }
            }

            await usuarioRepo.atualizarTentativas(usuario.sequsuario, {
                tentativas_login,
                nivel_bloqueio,
                bloqueado_ate,
                status: novoStatus,
            });
        }

        if (usuario.status === "locked") {
            throw new AppError(
                "Conta bloqueada permanentemente. Contate o administrador.",
                403,
                "ACCOUNT_LOCKED"
            );
        }

        const bloqueado_ate = usuario.bloqueado_ate ? Number(usuario.bloqueado_ate) : null;

        if (bloqueado_ate && bloqueado_ate > Date.now()) {
            const minutosRestantes = Math.ceil(
                (bloqueado_ate - Date.now()) / 60000
            );

            throw new AppError(
                `Tente novamente em ${minutosRestantes} minuto(s).`,
                403,
                "ACCOUNT_TEMPORARILY_LOCKED"
            );
        }

        if (loginInvalido) {
            throw new AppError(
                "Usuário ou senha inválidos.",
                401,
                "INVALID_CREDENTIALS"
            );
        }

        console.log("loginValido");

        await usuarioRepo.atualizarTentativas(usuario.sequsuario, {
            tentativas_login: 0,
            nivel_bloqueio: 0,
            bloqueado_ate: null,
            status: "active",
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
        console.log("aqui");
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
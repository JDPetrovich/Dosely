import bcrypt from "bcrypt";
import { ICadastrarUsuario } from "../../interfaces/usuario/usuario.interface.js";
import { UsuarioRepository } from "../../repository/usuario/usuario.repository.js";
import { AppError } from "../../errors/app.error.js";

const usuarioRepo = new UsuarioRepository();

export class UsuarioService {
    async buscarUsuarioPorEmail(email: string) {
        const usuario = await usuarioRepo.buscarPorEmail(email);
        if (!usuario) {
            throw new AppError(
                "Usuário não encontrado",
                404,
                "USER_NOT_FOUND"
            )
        }
        return usuario;
    }

    async buscarUsuarioPorSeq(sequsuario: number) {
        const usuario = await usuarioRepo.buscarUsuarioPorSeq(sequsuario);
        if (!usuario) {
            throw new AppError(
                "Usuário não encontrado",
                404,
                "USER_NOT_FOUND"
            );
        }
        return usuario;
    }

    async criarUsuario(dados: ICadastrarUsuario) {
        const { nome, email, login, senha } = dados;

        const emailExists = await usuarioRepo.buscarPorEmail(email);

        if (emailExists) {
            throw new AppError(
                "Email informado já está em uso",
                409,
                "EMAIL_ALREADY_EXISTS"
            )
        }


        const loginExists = await usuarioRepo.buscarPorLogin(login);

        if (loginExists) {
            throw new AppError(
                "Login informado já está em uso",
                409,
                "LOGIN_ALREADY_EXISTS"
            )
        }

        const hash = await bcrypt.hash(senha, 10);

        const dadosRepo: ICadastrarUsuario = {
            nome,
            email,
            login,
            senha: hash
        };

        await usuarioRepo.criarUsuario(dadosRepo);
    }
}
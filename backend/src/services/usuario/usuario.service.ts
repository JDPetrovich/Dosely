import bcrypt from "bcrypt";
import { ICadastrarUsuario } from "../../interfaces/usuario/usuario.interface.js";
import { UsuarioRepository } from "../../repository/usuario/usuario.repository.js";

const usuarioRepo = new UsuarioRepository();

export class UsuarioService {
    async buscarUsuarioPorEmail(email: string) {
        const usuario = await usuarioRepo.buscarPorEmail(email);
        if (!usuario) {
            throw {
                statusCode: 404,
                mensagem: "Usuário não encontrado."
            };
        }
        return usuario;
    }

    async buscarUsuarioPorSeq(sequsuario: number) {
        const usuario = await usuarioRepo.buscarUsuarioPorSeq(sequsuario);
        if (!usuario) {
            throw {
                statusCode: 404,
                mensagem: "Usuário não encontrado."
            };
        }
        return usuario;
    }

    async criarUsuario(dados: ICadastrarUsuario) {
        const { nome, email, login, senha } = dados;

        const emailExists = await usuarioRepo.buscarPorEmail(email);

        if (emailExists) {
            throw {
                statusCode: 409,
                mensagem: "O e-mail informado já está cadastrado"
            };
        }

        const loginExists = await usuarioRepo.buscarPorLogin(login);

        if (loginExists) {
            throw {
                statusCode: 409,
                mensagem: "Login informado já está em uso"
            };
        }

        const hash = await bcrypt.hash(senha, 10);

        const dadosRepo: ICadastrarUsuario = {
            nome,
            email,
            login,
            senha: hash
        };

        await usuarioRepo.criarUsuario(dadosRepo);

        return {
            sucesso: true,
            mensagem: "Usuário criado com sucesso"
        }
    }
}
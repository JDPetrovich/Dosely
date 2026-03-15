import { ipcMain } from "electron";
import { UsuarioRepository } from "../repository/usuario.repository.js";
import IUsuario from "../interfaces/usuario/usuario.interface";
import ITelaUsuario from "../interfaces/usuario/telaUsuario.interface.js";

interface IRespostaIpc {
    sucesso: boolean,
    mensagem: string,
    dados?: ITelaUsuario[]
}

const prepararRespostaUsuario = (
    usuario: IUsuario[],
    indsucesso: boolean = true,
    mensagemerro: string = ""
): IRespostaIpc => {
    return {
        dados: usuario,
        sucesso: indsucesso,
        mensagem: mensagemerro
    }
}

export async function usuariohandle() {
    const repo = new UsuarioRepository();

    ipcMain.handle("retornar-usuarios", async () => {
        try {
            const usuario = await repo.buscarUsuarios();
            return prepararRespostaUsuario(usuario);
        } catch (error) {
            return prepararRespostaUsuario([], false, (error as Error).message);
        }
    });

    ipcMain.handle("criar-usuario", async (_, dadosUsuario: IUsuario) => {
        try {
            await repo.criarUsuario(dadosUsuario);
            return prepararRespostaUsuario([], true, "Usuário criado com sucesso!");
        } catch (error) {
            return prepararRespostaUsuario([], false, (error as Error).message);
        }
    })

    ipcMain.handle("atualizar-usuario", async (_, dadosUsuario: IUsuario) => {
        try {
            await repo.atualizarUsuario(dadosUsuario);
            return prepararRespostaUsuario([], true, "Usuário atualizado com sucesso!");
        } catch (error) {
            return prepararRespostaUsuario([], false, (error as Error).message);
        }
    })

    ipcMain.handle("deletar-usuario", async (_, sequsuario: number) => {
        try {
            await repo.deletarUsuario(sequsuario);
            return prepararRespostaUsuario([], true, "Usuário deletado com sucesso!");
        } catch (error) {
            return prepararRespostaUsuario([], false, (error as Error).message);
        }
    })
}
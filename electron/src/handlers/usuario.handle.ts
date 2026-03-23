import { ipcMain } from "electron";
import axios from "axios";

const API_BASE = "http://localhost:3000/api";
const API_KEY = "jaumgostoso";

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        "x-api-key": API_KEY
    }
});

export async function usuariohandle() {

    ipcMain.handle("retornar-usuarios", async () => {
        try {
            const res = await api.get("/usuarios");
            return res.data;
        } catch (error) {
            return { sucesso: false, mensagem: (error as Error).message };
        }
    });

    ipcMain.handle("criar-usuario", async (_, dadosUsuario) => {
        try {
            const res = await api.post("/usuarios", dadosUsuario);
            return { sucesso: true, dados: res.data };
        } catch (error) {
            return { sucesso: false, mensagem: (error as Error).message };
        }
    });

    ipcMain.handle("atualizar-usuario", async (_, dadosUsuario) => {
        try {
            const res = await api.put(`/usuarios/${dadosUsuario.sequsuario}`, dadosUsuario);
            return { sucesso: true, dados: res.data };
        } catch (error) {
            return { sucesso: false, mensagem: (error as Error).message };
        }
    });

    ipcMain.handle("deletar-usuario", async (_, sequsuario: number, codusuario: string) => {
        try {
            await api.delete(`/usuarios/${sequsuario}`, { data: { codusuario } });
            return { sucesso: true };
        } catch (error) {
            return { sucesso: false, mensagem: (error as Error).message };
        }
    });
}
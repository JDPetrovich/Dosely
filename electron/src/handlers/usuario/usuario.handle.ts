import { ipcMain } from "electron";
import { apiFetch } from "../../util/apiFetch.js";
import { TokenStore } from "../../util/tokenStore.js";

export function usuarioHandle() {
    ipcMain.handle("login", async (_, { login, senha }) => {
        try {
            const data = await apiFetch("/login", {
                method: "POST",
                body: { login, senha },
            });

            if (data.sucesso) {
                TokenStore.set(data.dados.accessToken, data.dados.refreshToken);
            }

            return data
        } catch (error: any) {
            const res = error?.response?.data;

            return {
                sucesso: false,
                mensagem: res?.mensagem || "Erro ao fazer login",
                statusCode: error?.response?.status || 500,
            };
        }
    });
}
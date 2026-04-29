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
        } catch (error) {
            return { sucesso: false, mensagem: (error as Error).message };
        }
    });

    ipcMain.handle("me", async () => {
        try {

            const result = await apiFetch("/me");


            return result;
        } catch (error: any) {
            return {
                sucesso: false,
                mensagem: error.message,
            };
        }
    });
}
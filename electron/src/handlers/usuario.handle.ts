import { ipcMain } from "electron";
import { apiFetch } from "../util/apiFetch.js";

export function usuarioHandle() {
    ipcMain.handle("login", async (_, { login, senha }) => {
        try {
            const data = await apiFetch("/login", {
                method: "POST",
                body: JSON.stringify({ login, senha }),
            });

            return data
        } catch (error) {
            return { sucesso: false, mensagem: (error as Error).message };
        }
    });

    ipcMain.handle("me", async () => {
        try {
            return await apiFetch("/me");
        } catch (error: any) {
            return {
                sucesso: false,
                mensagem: error.message,
            };
        }
    });
}
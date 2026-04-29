import { ipcMain } from "electron";
import { AuthService } from "../../services/auth.service.js";
import { bootstrapAuth, refreshTokens } from "../../auth/bootstrapAuth.js";

const authService = new AuthService();

export function authHandle() {

    ipcMain.handle("logout", async () => {
        try {
            await authService.logout();
            return { sucesso: true };
        } catch (error: any) {
            return {
                sucesso: false,
                mensagem: error.message,
            };
        }
    });

    ipcMain.handle("refresh", async () => {
        try {
            const success = await refreshTokens();
            return { sucesso: success };
        } catch (error) {
            return { sucesso: false };
        }
    });

    ipcMain.handle("get-access-token", async () => {
        return authService.getAccessToken();
    });
}
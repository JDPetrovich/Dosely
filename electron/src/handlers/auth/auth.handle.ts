import { ipcMain } from "electron";
import { AuthService } from "../../services/auth.service.js";

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

    ipcMain.handle("get-access-token", async () => {
        return authService.getAccessToken();
    });
}
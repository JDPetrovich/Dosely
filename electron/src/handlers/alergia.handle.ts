import { ipcMain } from "electron";
import { apiFetch } from "../util/apiFetch.js";


export function alergiaHandle() {
    ipcMain.handle("retornar-alergias", async () => {
        try {
            const data = await apiFetch("/alergias");
            return data;
        } catch (error) {
            return { sucesso: false, mensagem: (error as Error).message };
        }
    });

}
import { ipcMain } from "electron";
import { apiFetch } from "../../util/apiFetch.js";

export function medicamentoHandle() {
    ipcMain.handle("retornar-medicamentos", async () => {
        try {
            const data = await apiFetch("/medicamentos");
            return data;
        } catch (error) {
            return { sucesso: false, mensagem: (error as Error).message };
        }
    });

}
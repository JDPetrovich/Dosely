import { ipcMain } from "electron";
import { apiFetch } from "../../util/apiFetch.js";

export function alergiaPacienteHandle() {
    ipcMain.handle("retornar-paciente-alergias", async (_, seqpaciente: number) => {
        try {
            const data = await apiFetch(`/alergias/paciente/${seqpaciente}`);
            return data;
        } catch (error) {
            return { sucesso: false, mensagem: (error as Error).message };
        }
    });

}
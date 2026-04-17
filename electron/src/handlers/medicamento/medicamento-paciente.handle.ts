import { ipcMain } from "electron";
import { apiFetch } from "../../util/apiFetch.js";

export function medicamentoPacienteHandle() {
    ipcMain.handle("retornar-paciente-medicamentos", async (_, seqpaciente: number) => {
        try {
            const data = await apiFetch(`/medicamentos/paciente/${seqpaciente}`);
            return data;
        } catch (error) {
            return { sucesso: false, mensagem: (error as Error).message };
        }
    });

}
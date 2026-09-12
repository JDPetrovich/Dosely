import { ipcMain } from "electron";
import { apiFetch } from "../../util/apiFetch.js";

export function pacientehandle() {

    ipcMain.handle("retornar-pacientes", async () => {
        try {
            return await apiFetch("/pacientes");
        } catch (error) {
            return { sucesso: false, mensagem: (error as Error).message };
        }
    });

    ipcMain.handle("criar-paciente", async (_, dadosPaciente) => {
        console.log(dadosPaciente);
        try {
            const data = await apiFetch("/paciente", {
                method: "POST",
                body: JSON.stringify(dadosPaciente),
            });
            return data;
        } catch (error) {
            return { sucesso: false, mensagem: (error as Error).message };
        }
    });

    ipcMain.handle("atualizar-paciente", async (_, dadosPaciente) => {
        try {
            return await apiFetch(`/paciente/${dadosPaciente.seqpaciente}`, {
                method: "PUT",
                body: JSON.stringify(dadosPaciente),
            });
        } catch (error) {
            return { sucesso: false, mensagem: (error as Error).message };
        }
    });

    ipcMain.handle("deletar-paciente", async (_, seqpaciente: number, login: string) => {
        try {
            return await apiFetch(`/paciente/${seqpaciente}`, {
                method: "DELETE",
                body: JSON.stringify({ login }),
            });
        } catch (error) {
            return { sucesso: false, mensagem: (error as Error).message };
        }
    });
}
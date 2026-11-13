import { ipcMain } from "electron";
import { apiFetch } from "../../util/apiFetch.js";

export function pacientehandle() {

    ipcMain.handle("retornar-pacientes", async () => {
        try {
            return await apiFetch("/pacientes");
        } catch (error: any) {
            const res = error?.response?.data;
            return {
                sucesso: false,
                mensagem: res?.message || "Erro ao buscar pacientes.",
                statusCode: error?.response?.status || 500,
            };
        }
    });

    ipcMain.handle("criar-paciente", async (_, dadosPaciente) => {
        try {
            const data = await apiFetch("/paciente", {
                method: "POST",
                body: JSON.stringify(dadosPaciente),
            });
            return data;
        } catch (error: any) {
            const res = error?.response?.data;
            return {
                sucesso: false,
                mensagem: res?.message || "Erro ao criar paciente.",
                statusCode: error?.response?.status || 500,
            };
        }
    });

    ipcMain.handle("atualizar-paciente", async (_, dadosPaciente) => {
        try {
            return await apiFetch(`/paciente/${dadosPaciente.seqpaciente}`, {
                method: "PUT",
                body: JSON.stringify(dadosPaciente),
            });
        } catch (error: any) {
            const res = error?.response?.data;
            return {
                sucesso: false,
                mensagem: res?.message || "Erro ao atualizar paciente.",
                statusCode: error?.response?.status || 500,
            };
        }
    });

    ipcMain.handle("deletar-paciente", async (_, seqpaciente: number, login: string) => {
        try {
            return await apiFetch(`/paciente/${seqpaciente}`, {
                method: "DELETE",
                body: JSON.stringify({ login }),
            });
        } catch (error: any) {
            const res = error?.response?.data;
            return {
                sucesso: false,
                mensagem: res?.message || "Erro ao deletar paciente.",
                statusCode: error?.response?.status || 500,
            };
        }
    });
}
import { ipcMain } from "electron";
import { apiFetch } from "../../util/apiFetch.js";

export function alergiaPacienteHandle() {
    ipcMain.handle("retornar-paciente-alergias", async (_, seqpaciente: number) => {
        try {
            const data = await apiFetch(`/alergias/paciente/${seqpaciente}`);
            return data;
        } catch (error: any) {
            const res = error?.response?.data;
            return {
                sucesso: false,
                mensagem: res?.message || "Erro ao retornar alergias do paciente.",
                statusCode: error?.response?.status || 500,
            };
        }
    });

    ipcMain.handle("associar-alergia-paciente", async (_, seqpaciente: number, seqalergia: number) => {
        try {
            return await apiFetch(`/alergias/paciente/${seqpaciente}`, {
                method: "POST",
                body: JSON.stringify({ seqalergia }),
            });
        } catch (error: any) {
            const res = error?.response?.data;
            return {
                sucesso: false,
                mensagem: res?.message || res?.mensagem || "Erro ao associar alergia.",
                statusCode: error?.response?.status || 500,
            };
        }
    });

    ipcMain.handle("desassociar-alergia-paciente", async (_, seqpaciente: number, seqalergia: number) => {
        try {
            return await apiFetch(`/alergias/paciente/${seqpaciente}/${seqalergia}`, {
                method: "DELETE",
            });
        } catch (error: any) {
            const res = error?.response?.data;
            return {
                sucesso: false,
                mensagem: res?.message || res?.mensagem || "Erro ao remover alergia do paciente.",
                statusCode: error?.response?.status || 500,
            };
        }
    });
}
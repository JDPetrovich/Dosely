import { ipcMain } from "electron";
import { apiFetch } from "../../util/apiFetch.js";

export function medicamentoHandle() {
    ipcMain.handle("retornar-medicamentos", async () => {
        try {
            const data = await apiFetch("/medicamentos");
            return data;
        } catch (error: any) {
            const res = error?.response?.data;
            return {
                sucesso: false,
                mensagem: res?.message || "Erro ao retornar medicamentos.",
                statusCode: error?.response?.status || 500,
            };
        }
    });

    ipcMain.handle("criar-medicamento", async (_, dados) => {
        try {
            const data = await apiFetch("/medicamento", {
                method: "POST",
                body: JSON.stringify(dados),
            });
            return data;
        } catch (error: any) {
            const res = error?.response?.data;
            return {
                sucesso: false,
                mensagem: res?.message || "Erro ao criar medicamento.",
                statusCode: error?.response?.status || 500,
            };
        }
    });

    ipcMain.handle("atualizar-medicamento", async (_, seqmedicamento: number, dados) => {
        try {
            const data = await apiFetch(`/medicamento/${seqmedicamento}`, {
                method: "PUT",
                body: JSON.stringify(dados),
            });
            return data;
        } catch (error: any) {
            const res = error?.response?.data;
            return {
                sucesso: false,
                mensagem: res?.message || "Erro ao atualizar medicamento.",
                statusCode: error?.response?.status || 500,
            };
        }
    });


    ipcMain.handle("deletar-medicamento", async (_, seqmedicamento: number) => {
        try {
            const data = await apiFetch(`/medicamento/${seqmedicamento}`, {
                method: "DELETE",
            });
            return data;
        } catch (error: any) {
            const res = error?.response?.data;
            return {
                sucesso: false,
                mensagem: res?.message || "Erro ao deletar medicamento.",
                statusCode: error?.response?.status || 500,
            };
        }
    });
}
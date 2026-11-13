import { ipcMain } from "electron";
import { apiFetch } from "../../util/apiFetch.js";

export function alergiaHandle() {
    ipcMain.handle("retornar-alergias", async () => {
        try {
            const data = await apiFetch("/alergias");
            return data;
        } catch (error: any) {
            const res = error?.response?.data;
            return {
                sucesso: false,
                mensagem: res?.message || "Erro ao retornar alergias.",
                statusCode: error?.response?.status || 500,
            };
        }
    });

    ipcMain.handle("criar-alergia", async (_, descricao: string) => {
        try {
            return await apiFetch("/alergia", {
                method: "POST",
                body: JSON.stringify({ descricao }),
            });
        } catch (error: any) {
            const res = error?.response?.data;
            return {
                sucesso: false,
                mensagem: res?.message || res?.mensagem || "Erro ao criar alergia.",
                statusCode: error?.response?.status || 500,
            };
        }
    });

    ipcMain.handle("atualizar-alergia", async (_, seqalergia: number, descricao: string) => {
        try {
            return await apiFetch(`/alergia/${seqalergia}`, {
                method: "PUT",
                body: JSON.stringify({ descricao }),
            });
        } catch (error: any) {
            const res = error?.response?.data;
            return {
                sucesso: false,
                mensagem: res?.message || res?.mensagem || "Erro ao atualizar alergia.",
                statusCode: error?.response?.status || 500,
            };
        }
    });

    ipcMain.handle("deletar-alergia", async (_, seqalergia: number) => {
        try {
            return await apiFetch(`/alergia/${seqalergia}`, {
                method: "DELETE",
            });
        } catch (error: any) {
            const res = error?.response?.data;
            return {
                sucesso: false,
                mensagem: res?.message || res?.mensagem || "Erro ao deletar alergia.",
                statusCode: error?.response?.status || 500,
            };
        }
    });
}
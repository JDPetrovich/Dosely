import { ipcMain } from "electron";
import { apiFetch } from "../../util/apiFetch.js";

export function tarefaHandle() {
    ipcMain.handle("retornar-tarefas", async () => {
        try {
            const data = await apiFetch("/tarefas");
            return data;
        } catch (error) {
            return { sucesso: false, mensagem: (error as Error).message };
        }
    });

    ipcMain.handle("criar-tarefa", async (_, descricao: string) => {
        try {
            const data = await apiFetch("/tarefa", {
                method: "POST",
                body: JSON.stringify({ descricao }),
            });
            return data;
        } catch (error) {
            return { sucesso: false, mensagem: (error as Error).message };
        }
    });

    ipcMain.handle("atualizar-tarefa", async (_, seqtarefa: number, descricao: string) => {
        try {
            const data = await apiFetch(`/tarefa/${seqtarefa}`, {
                method: "PUT",
                body: JSON.stringify({ descricao }),
            });
            return data;
        } catch (error) {
            return { sucesso: false, mensagem: (error as Error).message };
        }
    });

    ipcMain.handle("alterar-status-tarefa", async (_, seqtarefa: number, concluido: boolean) => {
        try {
            const data = await apiFetch(`/tarefa/${seqtarefa}`, {
                method: "PATCH",
                body: JSON.stringify({ concluido }),
            });
            return data;
        } catch (error) {
            return { sucesso: false, mensagem: (error as Error).message };
        }
    });
}
import { ipcMain } from "electron";
import { apiFetch } from "../../util/apiFetch.js";
import type { ITratamentoBody } from "@dosely/shared";

export function tratamentoPacienteHandle() {
    ipcMain.handle("retornar-tratamentos", async (_, seqpaciente: number) => {
        try {
            return await apiFetch(`/paciente/${seqpaciente}/tratamentos`,);
        } catch (error: any) {
            const res = error?.response?.data;
            return {
                sucesso: false,
                mensagem: res?.message || "Erro ao retornar tratamentos do paciente.",
                statusCode: error?.response?.status || 500,
            };
        }
    });

    ipcMain.handle("criar-tratamento", async (_, seqpaciente: number, dados: ITratamentoBody) => {
        try {
            return await apiFetch(`/paciente/${seqpaciente}/tratamento`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });
        } catch (error: any) {
            const res = error?.response?.data;
            return {
                sucesso: false,
                mensagem: res?.message || "Erro ao criar tratamento.",
                statusCode: error?.response?.status || 500,
            };
        }
    });

    ipcMain.handle("atualizar-tratamento", async (_, seqpaciente: number, seqtratamento: number, dados: ITratamentoBody) => {
        try {
            return await apiFetch(`/paciente/${seqpaciente}/tratamento/${seqtratamento}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });
        } catch (error: any) {
            const res = error?.response?.data;
            return {
                sucesso: false,
                mensagem: res?.message || "Erro ao atualizar tratamento.",
                statusCode: error?.response?.status || 500,
            };
        }
    });

    ipcMain.handle("deletar-tratamento", async (_, seqpaciente: number, seqtratamento: number) => {
        try {
            return await apiFetch(`/paciente/${seqpaciente}/tratamento/${seqtratamento}`, {
                method: "DELETE"
            });
        } catch (error: any) {
            const res = error?.response?.data;
            return {
                sucesso: false,
                mensagem: res?.message || "Erro ao deletar tratamento.",
                statusCode: error?.response?.status || 500,
            };
        }
    });
}
import { contextBridge, ipcRenderer } from "electron";
import type { ITratamentoBody } from "@dosely/shared"

contextBridge.exposeInMainWorld("api", {
    auth: {
        login: (dados: any) => ipcRenderer.invoke("login", dados),
        logout: () => ipcRenderer.invoke("logout"),
        refresh: () => ipcRenderer.invoke("refresh"),
        me: () => ipcRenderer.invoke("me")
    },
    pacientes: {
        buscar: () => ipcRenderer.invoke("retornar-pacientes"),
        criar: (dados: any) => ipcRenderer.invoke("criar-paciente", dados),
        atualizar: (dados: any) => ipcRenderer.invoke("atualizar-paciente", dados),
        deletar: (id: number, login: string) => ipcRenderer.invoke("deletar-paciente", id, login),
    },
    alergias: {
        buscar: () => ipcRenderer.invoke("retornar-alergias"),
        criar: (descricao: string) => ipcRenderer.invoke("criar-alergia", descricao),
        atualizar: (seqalergia: number, descricao: string) => ipcRenderer.invoke("atualizar-alergia", seqalergia, descricao),
        deletar: (seqalergia: number) => ipcRenderer.invoke("deletar-alergia", seqalergia),
    },
    alergiasPaciente: {
        buscar: (seqpaciente: number) => ipcRenderer.invoke("retornar-paciente-alergias", seqpaciente),
        associar: (seqpaciente: number, seqalergia: number) => ipcRenderer.invoke("associar-alergia-paciente", seqpaciente, seqalergia),
        desassociar: (seqpaciente: number, seqalergia: number) => ipcRenderer.invoke("desassociar-alergia-paciente", seqpaciente, seqalergia),
    },
    medicamentos: {
        buscar: () => ipcRenderer.invoke("retornar-medicamentos"),
        criar: (dados: any) => ipcRenderer.invoke("criar-medicamento", dados),
        atualizar: (seqmedicamento: number, dados: any) => ipcRenderer.invoke("atualizar-medicamento", seqmedicamento, dados),
        deletar: (seqmedicamento: number) => ipcRenderer.invoke("deletar-medicamento", seqmedicamento),
    },
    tratamentosPaciente: {
        buscar: (seqpaciente: number) => ipcRenderer.invoke("retornar-tratamentos", seqpaciente),
        criar: (seqpaciente: number, dados: ITratamentoBody) => ipcRenderer.invoke("criar-tratamento", seqpaciente, dados),
        atualizar: (seqpaciente: number, seqtratamento: number, dados: ITratamentoBody) => ipcRenderer.invoke("atualizar-tratamento", seqpaciente, seqtratamento, dados),
        deletar: (seqpaciente: number, seqtratamento: number) => ipcRenderer.invoke("deletar-tratamento", seqpaciente, seqtratamento),
    },
    tarefas: {
        buscar: () => ipcRenderer.invoke("retornar-tarefas"),
        criar: (descricao: string) => ipcRenderer.invoke("criar-tarefa", descricao),
        atualizar: (seqtarefa: number, descricao: string) => ipcRenderer.invoke("atualizar-tarefa", seqtarefa, descricao),
        alterarStatus: (seqtarefa: number, concluido: boolean) => ipcRenderer.invoke("alterar-status-tarefa", seqtarefa, concluido),
    },
    onApiStatus: (callback: (status: "ok" | "down" | "degraded") => void) => {
        const handler = (_: any, status: "ok" | "down" | "degraded") => callback(status);

        ipcRenderer.on("api-status", handler);

        return () => {
            ipcRenderer.removeListener("api-status", handler);
        };
    },
});
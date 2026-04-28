import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
    auth: {
        login: (dados: any) => ipcRenderer.invoke("login", dados),
        logout: () => ipcRenderer.invoke("logout"),
        refresh: () => ipcRenderer.invoke("refresh"),
        me: () => ipcRenderer.invoke("me"),
        getAccessToken: () => ipcRenderer.invoke("get-access-token"),
    },
    pacientes: {
        buscar: () => ipcRenderer.invoke("retornar-pacientes"),
        criar: (dados: any) => ipcRenderer.invoke("criar-paciente", dados),
        atualizar: (dados: any) => ipcRenderer.invoke("atualizar-paciente", dados),
        deletar: (id: number, codpaciente: string) => ipcRenderer.invoke("deletar-paciente", id, codpaciente),
    },
    alergias: {
        buscar: () => ipcRenderer.invoke("retornar-alergias"),
    },
    alergiasPaciente: {
        buscar: (seqpaciente: number) => ipcRenderer.invoke("retornar-paciente-alergias", seqpaciente),
    },
    medicamentos: {
        buscar: () => ipcRenderer.invoke("retornar-medicamentos"),
    },
    medicamentosPaciente: {
        buscar: (seqpaciente: number) => ipcRenderer.invoke("retornar-paciente-medicamentos", seqpaciente),
    },
});
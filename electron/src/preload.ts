import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
    usuario: {
        login: (dados: any) => ipcRenderer.invoke("login", dados),
    },
    me: () => ipcRenderer.invoke("me"),
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
    }
});
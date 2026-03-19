import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
    usuarios: {
        buscar: () => ipcRenderer.invoke("retornar-usuarios"),
        criar: (dados: any) => ipcRenderer.invoke("criar-usuario", dados),
        atualizar: (dados: any) => ipcRenderer.invoke("atualizar-usuario", dados),
        deletar: (id: number) => ipcRenderer.invoke("deletar-usuario", id),
    }
});
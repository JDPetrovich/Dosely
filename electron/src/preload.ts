import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
    usuarios: {
        buscar: () => ipcRenderer.invoke("retornar-usuarios"),
        criar: (dados: any) => ipcRenderer.invoke("criar-usuario", dados),
        atualizar: (dados: any) => ipcRenderer.invoke("atualizar-usuario", dados),
        deletar: (id: number, codusuario: string) => ipcRenderer.invoke("deletar-usuario", id, codusuario),
    }
});
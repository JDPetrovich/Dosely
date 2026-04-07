import { app, BrowserWindow } from "electron";
import ControllMed from "./app/ControllMed.js";
import "dotenv/config";
import { pacientehandle } from "./handlers/paciente.handle.js";
import { alergiaHandle } from "./handlers/alergia.handle.js";
import { alergiaPacienteHandle } from "./handlers/alergia-paciente.handle.js";
import { usuarioHandle } from "./handlers/usuario.handle.js";

app.whenReady().then(async () => {
    ControllMed();
    pacientehandle();
    alergiaHandle();
    alergiaPacienteHandle();
    usuarioHandle();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        ControllMed();
    }
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
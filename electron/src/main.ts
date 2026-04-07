import { app, BrowserWindow } from "electron";
import Dosely from "./app/Dosely.js";
import "dotenv/config";
import { pacientehandle } from "./handlers/paciente.handle.js";
import { alergiaHandle } from "./handlers/alergia.handle.js";
import { alergiaPacienteHandle } from "./handlers/alergia-paciente.handle.js";
import { usuarioHandle } from "./handlers/usuario.handle.js";

app.whenReady().then(async () => {
    Dosely();
    pacientehandle();
    alergiaHandle();
    alergiaPacienteHandle();
    usuarioHandle();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        Dosely();
    }
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
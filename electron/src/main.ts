import { app, BrowserWindow } from "electron";
import Dosely from "./app/Dosely.js";
import "dotenv/config";
import { alergiaPacienteHandle } from "./handlers/alergia/alergia-paciente.handle.js";
import { alergiaHandle } from "./handlers/alergia/alergia.handle.js";
import { pacientehandle } from "./handlers/paciente/paciente.handle.js";
import { usuarioHandle } from "./handlers/usuario/usuario.handle.js";
import { medicamentoHandle } from "./handlers/medicamento/medicamento.handle.js";
import { medicamentoPacienteHandle } from "./handlers/medicamento/medicamento-paciente.handle.js";

app.whenReady().then(async () => {
    Dosely();
    usuarioHandle();
    pacientehandle();
    alergiaHandle();
    alergiaPacienteHandle();
    medicamentoHandle();
    medicamentoPacienteHandle();
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
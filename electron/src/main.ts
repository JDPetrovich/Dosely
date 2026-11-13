import { app, BrowserWindow } from "electron";
import Dosely from "./app/Dosely.js";

import "dotenv/config";

import { bootstrapAuth } from "./auth/bootstrapAuth.js";
import { authHandle } from "./handlers/auth/auth.handle.js";
import { alergiaPacienteHandle } from "./handlers/alergia/alergia-paciente.handle.js";
import { alergiaHandle } from "./handlers/alergia/alergia.handle.js";
import { pacientehandle } from "./handlers/paciente/paciente.handle.js";
import { usuarioHandle } from "./handlers/usuario/usuario.handle.js";
import { medicamentoHandle } from "./handlers/medicamento/medicamento.handle.js";
import { tratamentoPacienteHandle } from "./handlers/tratamento/tratamento.handle.js";
import { startApiHealthMonitor } from "./services/auth/apiHealthMonitor.js";
import { tarefaHandle } from "./handlers/tarefa/tarefa.handle.js";

app.whenReady().then(async () => {

    await bootstrapAuth();

    authHandle();
    usuarioHandle();
    pacientehandle();
    alergiaHandle();
    alergiaPacienteHandle();
    medicamentoHandle();
    tratamentoPacienteHandle();
    tarefaHandle();

    startApiHealthMonitor();
    Dosely();
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
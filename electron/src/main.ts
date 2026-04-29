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
import { medicamentoPacienteHandle } from "./handlers/medicamento/medicamento-paciente.handle.js";
import { TokenStore } from "./util/tokenStore.js";

app.whenReady().then(async () => {
    Dosely();

    await bootstrapAuth();

    authHandle();
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
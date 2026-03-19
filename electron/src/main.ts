import { app, BrowserWindow } from "electron";
import ControllMed from "./app/ControllMed.js";
import "dotenv/config";
import { usuariohandle } from "./handlers/usuario.handle.js";

app.whenReady().then(async () => {
    ControllMed();
    usuariohandle();
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
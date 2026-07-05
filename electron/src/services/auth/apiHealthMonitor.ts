import { BrowserWindow } from "electron";

const HEALTH_URL = "http://localhost:3000/health";

let failCount = 0;
const MAX_FAILS = 3;
let intervalRef: NodeJS.Timeout;

export function startApiHealthMonitor() {
    intervalRef = setInterval(async () => {
        const mainWindow = BrowserWindow.getAllWindows()[0];
        if (!mainWindow) return;

        try {
            const res = await fetch(HEALTH_URL);

            if (!res.ok) throw new Error("api down");

            const data = await res.json();

            if (data.status !== "ok") {
                mainWindow.webContents.send("api-status", "down");
                return;
            }

            if (data.db === "down") {
                failCount = 0;
                mainWindow.webContents.send("api-status", "degraded");
                return;
            }

            failCount = 0;
            mainWindow.webContents.send("api-status", "ok");

        } catch (error) {
            failCount++;

            if (failCount >= MAX_FAILS) {
                mainWindow.webContents.send("api-status", "down");
            }
        }
    }, 5000);
}

export function stopApiHealthMonitor() {
    clearInterval(intervalRef);
}
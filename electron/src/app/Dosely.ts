import { app, BrowserWindow, Menu } from "electron";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconPath = app.isPackaged
  ? path.join(process.resourcesPath, "resources/logo.png")
  : path.join(__dirname, "../../src/resources/logo.png");
let janela: BrowserWindow | null = null;

export default function Principal() {
  janela = new BrowserWindow({
    title: "Dosely",
    icon: iconPath,
    show: true,
    webPreferences: {
      preload: path.join(__dirname, "../preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    },
  });

  if (!app.isPackaged) {
    const menu = Menu.buildFromTemplate([
      {
        role: "viewMenu",
      },
      {
        role: "windowMenu",
      },
    ]);
    Menu.setApplicationMenu(menu);
  } else {
    Menu.setApplicationMenu(null);
  }

  if (!app.isPackaged) {
    const frontUrl = process.env.FRONTEND_URL!
    janela.loadURL(frontUrl);
  } else {
    const indexPath = path.resolve(
      __dirname,
      "../../../frontend/dist/index.html"
    );
    janela.loadFile(indexPath).catch(err => {
      console.error("Erro ao carregar o arquivo:", err);
    });
  }

  janela.webContents.on("before-input-event", (event, input) => {
    if (input.key === "F12") {
      event.preventDefault();
      janela?.webContents.toggleDevTools();
    }
  });

  janela.webContents.on('devtools-opened', () => {
    console.clear();
  });

  janela.webContents.once('did-finish-load', () => {
    janela?.maximize();
    janela?.show();
    if (!app.isPackaged) {
      janela?.webContents.openDevTools();
    }
  });

  janela.on("closed", () => (janela = null));
}
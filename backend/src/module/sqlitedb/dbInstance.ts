import path from "path";
import fs from "fs";
import envPaths from "env-paths";
import { DatabaseSQLite } from "./sqlite.js";

let db: DatabaseSQLite | null = null;

export function getDatabase() {
    if (!db) {
        const paths = envPaths("ControllMed");

        if (!fs.existsSync(paths.data)) {
            fs.mkdirSync(paths.data, { recursive: true });
        }

        const caminhoBanco = path.join(
            paths.data,
            "Controll_med.sqlite"
        );

        console.log("Banco:", caminhoBanco);
        db = new DatabaseSQLite(caminhoBanco);
    }

    return db;
}
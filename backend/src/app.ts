import cors from "cors";
import express from "express";
import pacienteRoutes from "./routes/paciente.routes.js";
import alergiaRoutes from "./routes/alergia.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import medicamentoRoutes from "./routes/medicamento.routes.js";
import authRoutes from "./routes/auth.routes.js";
import tarefaRoutes from "./routes/tarefa.routes.js";
import { verificarAuth } from "./middleware/auth.js";
import { getDatabase } from "./module/sqlitedb/dbInstance.js";
import { ErrorHandler } from "./errors/handle.error.js";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json());

app.use("/api", usuarioRoutes);
app.use("/api", authRoutes);

app.use("/api", verificarAuth, pacienteRoutes);
app.use("/api", alergiaRoutes);
app.use("/api", medicamentoRoutes);
app.use("/api", tarefaRoutes);

app.get("/health", async (req, res) => {
    try {
        const db = getDatabase();

        await db.consultar?.("SELECT 1");

        return res.json({
            status: "ok",
            timestamp: new Date(),
        });

    } catch (err) {

        return res.status(500).json({
            status: "erro",
            mensagem: "Sistema instável",
        });
    }
});

app.use(ErrorHandler.middleware);

app.get("/crash", (req, res) => {
    res.json({ mensagem: "Crashando em 2s..." });

    setTimeout(() => {
        throw new Error("CRASH INTENCIONAL");
    }, 2000);
});

export default app;
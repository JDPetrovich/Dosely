import "dotenv/config";
import app from "./app.js";
import { getDatabase } from "./module/sqlitedb/dbInstance.js";

const PORT = process.env.PORT || 3000;
const db = getDatabase();

process.on("uncaughtException", (err) => {
  console.error("❌ uncaughtException:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ unhandledRejection:", err);
  process.exit(1);
});

(async () => {
  try {
    await db.conectar();
    console.log("✅ Banco de dados conectado");

    app.listen(PORT, () => {
      console.log(`✅ Backend rodando em http://localhost:${PORT}`);
      console.log(`✅ Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar:", error);
    process.exit(1);
  }
})();
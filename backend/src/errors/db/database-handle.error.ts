import { AppError } from "../app.error.js";
import {
  getDatabaseErrorConfig,
  type DatabaseEngine,
} from "./database.error.js";

export class DatabaseErrorHandler {
  static handle(error: Error, database: DatabaseEngine): AppError {
    const config = getDatabaseErrorConfig(error, database);

    if (config) {
      return new AppError(config.message, config.statusCode, config.code);
    }

    return new AppError(
      "Ocorreu um erro ao processar os dados no banco de dados.",
      500,
      "DATABASE_ERROR",
    );
  }
}
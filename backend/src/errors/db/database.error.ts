export interface DatabaseErrorCodeConfig {
  code: string;
  message: string;
  statusCode: number;
}

export type DatabaseEngine = "sqlite";

const SQLITE_ERROR_CONFIGS: Array<{
  matches: (code: string, message: string) => boolean;
  config: DatabaseErrorCodeConfig;
}> = [
    {
      matches: (code, message) =>
        code === "SQLITE_CONSTRAINT_UNIQUE" ||
        code === "SQLITE_CONSTRAINT_PRIMARYKEY" ||
        /unique constraint failed|primary key/i.test(message),
      config: {
        code: "DATABASE_UNIQUE_CONSTRAINT",
        message: "Já existe um registro com estes dados.",
        statusCode: 409,
      },
    },
    {
      matches: (code, message) =>
        code === "SQLITE_CONSTRAINT_FOREIGNKEY" ||
        /foreign key constraint failed/i.test(message),
      config: {
        code: "DATABASE_FOREIGN_KEY_CONSTRAINT",
        message:
          "Não é possível concluir a operação porque o registro possui dependências.",
        statusCode: 409,
      },
    },
    {
      matches: (code, message) =>
        code === "SQLITE_CONSTRAINT_NOTNULL" ||
        /not null constraint failed/i.test(message),
      config: {
        code: "DATABASE_NOT_NULL_CONSTRAINT",
        message: "Um campo obrigatório não foi informado.",
        statusCode: 422,
      },
    },
    {
      matches: (code, message) =>
        code === "SQLITE_CONSTRAINT_CHECK" ||
        /check constraint failed/i.test(message),
      config: {
        code: "DATABASE_CHECK_CONSTRAINT",
        message: "Os dados informados não atendem às regras do registro.",
        statusCode: 422,
      },
    },
    {
      matches: (code, message) =>
        code === "SQLITE_BUSY" ||
        code === "SQLITE_LOCKED" ||
        /database is (locked|busy)/i.test(message),
      config: {
        code: "DATABASE_UNAVAILABLE",
        message: "O banco de dados está ocupado. Tente novamente em instantes.",
        statusCode: 503,
      },
    },
  ];

export function getDatabaseErrorConfig(
  error: Error,
  database: DatabaseEngine,
): DatabaseErrorCodeConfig | undefined {
  if (database !== "sqlite") return undefined;

  const code =
    "code" in error && typeof error.code === "string" ? error.code : "";

  return SQLITE_ERROR_CONFIGS.find(({ matches }) =>
    matches(code, error.message ?? ""),
  )?.config;
}
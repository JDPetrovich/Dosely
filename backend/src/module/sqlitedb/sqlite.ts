import sqlite3 from "sqlite3";
import { open, type Database } from "sqlite";

export class DatabaseSQLite {
    private conexao: Database | undefined;
    private caminho: string;

    constructor(caminhoBanco: string) {
        this.caminho = caminhoBanco;
    }

    async conectar(): Promise<void> {
        this.conexao = await open({
            filename: this.caminho,
            driver: sqlite3.Database
        });
        await this.conexao.exec("PRAGMA foreign_keys = ON;");
    }

    async fecharConexao() {
        if (!this.conexao) return;
        await this.conexao.close();
        this.conexao = undefined;
    }

    async consultar<T>(sql: string, params: any[] = []): Promise<T[]> {
        if (!this.conexao) throw new Error("Banco de dados não conectado!");
        return await this.conexao.all<T[]>(sql, params);
    }

    async executar(sql: string, params: any[] = []) {
        if (!this.conexao) throw new Error("Banco de dados não conectado!");
        return await this.conexao.run(sql, params);
    }

    async begin() {
        await this.conexao!.exec("BEGIN");
    }

    async commit() {
        await this.conexao!.exec("COMMIT");
    }

    async rollback() {
        await this.conexao!.exec("ROLLBACK");
    }
}

import { IRefreshToken } from "../../interfaces/token/token.interface.js";
import { getDatabase } from "../../module/sqlitedb/dbInstance.js";
import { hashToken } from "../../util/hash-token.js";

const db = getDatabase();

export class UsuarioRefreshRepository {
    async salvar(sequsuario: number, token: string, expiraEm: number) {
        const tokenHash = hashToken(token);

        const query = `
            INSERT INTO usuario_refresh_token (sequsuario, token, expira_em)
            VALUES (?, ?, ?)
        `;

        const parametros = [sequsuario, tokenHash, expiraEm];

        await db.executar(query, parametros);
    }

    async buscar(token: string): Promise<IRefreshToken | null> {
        const tokenHash = hashToken(token);

        const query = `
            SELECT * FROM usuario_refresh_token
            WHERE token = ? LIMIT 1
        `;
        const result = await db.consultar<IRefreshToken>(query, [tokenHash]);
        return result[0] || null;
    }

    async revogar(token: string) {
        const tokenHash = hashToken(token);

        const query = `
            UPDATE usuario_refresh_token
            SET revogado = 1
            WHERE token = ?
        `;
        await db.executar(query, [tokenHash]);
    }

    async limparExpirados() {
        const query = `
            DELETE FROM usuario_refresh_token
            WHERE expira_em < ?
        `;
        await db.executar(query, [Date.now()]);
    }
}
import bcrypt from "bcrypt";
import IUsuario, { ICadastrarUsuario } from "../../interfaces/usuario/usuario.interface.js";
import { getDatabase } from "../../module/sqlitedb/dbInstance.js";
import { DatabaseErrorHandler } from "../../errors/index.js";

const db = getDatabase();

export class UsuarioRepository {
    async buscarPorEmail(email: string): Promise<IUsuario | null> {
        const query = `
            SELECT sequsuario, login, senha, nome, email,
            loginAttempts, failedBlocks, lockUntil, status
            FROM usuario            
            WHERE email = ?
        `;

        const params = [email];
        const resultado = await db.consultar<IUsuario>(query, params);
        return resultado[0] || null;
    }

    async buscarUsuarioPorSeq(sequsuario: number): Promise<IUsuario | null> {
        const query = `
            SELECT sequsuario, login, senha, nome, email,
            loginAttempts, failedBlocks, lockUntil, status
            FROM usuario
            WHERE sequsuario = ?
        `;

        const params = [sequsuario];
        const resultado = await db.consultar<IUsuario>(query, params);
        return resultado[0] || null;
    }

    async buscarPorLogin(login: string): Promise<IUsuario | null> {
        const query = `
            SELECT sequsuario, login, senha, nome, email,
            loginAttempts, failedBlocks, lockUntil, status
            FROM usuario
            WHERE login = ?
        `;

        const resultado = await db.consultar<IUsuario>(query, [login]);
        return resultado[0] || null;
    }

    async criarUsuario(dados: ICadastrarUsuario) {
        const { login, senha, nome, email } = dados;
        const query = `
            INSERT INTO usuario (login, senha, nome, email, loginAttempts, failedBlocks, lockUntil, status)
            VALUES (?, ?, ?, ?, 0, 0, NULL, 'active')
        `;

        const parametros = [login, senha, nome, email];

        await db.executar(query, parametros);
        return;
    }

    async validarSenha(senha: string, hash: string) {
        return bcrypt.compare(senha, hash);
    }

    async atualizarTentativas(
        sequsuario: number,
        data: Partial<Pick<IUsuario, 'loginAttempts' | 'failedBlocks' | 'lockUntil' | 'status'>>
    ): Promise<void> {
        const sets: string[] = [];
        const valores: any[] = [];

        if (data.loginAttempts !== undefined) {
            sets.push('loginAttempts = ?');
            valores.push(data.loginAttempts);
        }
        if (data.failedBlocks !== undefined) {
            sets.push('failedBlocks = ?');
            valores.push(data.failedBlocks);
        }
        if (data.lockUntil !== undefined) {
            sets.push('lockUntil = ?');
            valores.push(data.lockUntil);
        }
        if (data.status !== undefined) {
            sets.push('status = ?');
            valores.push(data.status);
        }

        if (sets.length === 0) return;

        valores.push(sequsuario);
        const query = `UPDATE usuario SET ${sets.join(', ')} WHERE sequsuario = ?`;
        await db.executar(query, valores);
    }
}
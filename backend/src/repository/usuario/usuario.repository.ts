import bcrypt from "bcrypt";
import IUsuario, { ICadastrarUsuario } from "../../interfaces/usuario/usuario.interface.js";
import { getDatabase } from "../../module/sqlitedb/dbInstance.js";

const db = getDatabase();

export class UsuarioRepository {
    async buscarPorEmail(email: string): Promise<IUsuario | null> {
        const query = `
            SELECT sequsuario, login, senha, nome, email,
            tentativas_login, nivel_bloqueio, bloqueado_ate, status
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
            tentativas_login, nivel_bloqueio, bloqueado_ate, status
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
                tentativas_login, nivel_bloqueio, bloqueado_ate, status
            FROM usuario WHERE login = ?
        `;

        const resultado = await db.consultar<IUsuario>(query, [login]);
        return resultado[0] || null;
    }

    async criarUsuario(dados: ICadastrarUsuario) {
        const { login, senha, nome, email } = dados;
        const query = `
            INSERT INTO usuario (login, senha, nome, email, tentativas_login, nivel_bloqueio, bloqueado_ate, status)
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
        data: Partial<Pick<IUsuario, 'tentativas_login' | 'nivel_bloqueio' | 'bloqueado_ate' | 'status'>>
    ): Promise<void> {
        const sets: string[] = [];
        const valores: any[] = [];

        if (data.tentativas_login !== undefined) {
            sets.push('tentativas_login = ?');
            valores.push(data.tentativas_login);
        }
        if (data.nivel_bloqueio !== undefined) {
            sets.push('nivel_bloqueio = ?');
            valores.push(data.nivel_bloqueio);
        }
        if (data.bloqueado_ate !== undefined) {
            sets.push('bloqueado_ate = ?');
            valores.push(data.bloqueado_ate);
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
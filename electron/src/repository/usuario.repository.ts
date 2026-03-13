import IUsuario from "../interfaces/usuario/usuario.interface";
import { getDatabase } from "../module/sqlitedb/dbInstance.js";
import { getSupabase } from "../module/supabase/supabaseInstance.js";

const db = getDatabase();
const supabase = getSupabase();

class UsuarioRepository {
    async buscarUsuarios(): Promise<IUsuario[]> {
        const query = `
    SELECT 
        sequsuario,
        nomeusuario,
        dtnascimentousuario,
        codusuario,
        senhausuario,
        cpfusuario,
        telusuario,
        emailusuario
    FROM usuario    
    `;

        const resultado = await db.consultar<IUsuario>(query, []);
        return resultado;
    }

    async criarUsuario(dadosUsuario: IUsuario): Promise<void> {

        const query = `
        INSERT INTO usuario (
        nomeusuario,
        dtnascimentousuario,
        codusuario,
        senhausuario,
        cpfusuario,
        telusuario,
        emailusuario
        ) VALUES (?,?,?,?,?,?,?)
        `;

        const parametros = [
            dadosUsuario.nomeusuario,
            dadosUsuario.dtnascimentousuario,
            dadosUsuario.codusuario,
            dadosUsuario.senhausuario,
            dadosUsuario.cpfusuario,
            dadosUsuario.telusuario,
            dadosUsuario.emailusuario
        ];

        try {
            await db.executar(query, parametros);
        } catch (err) {
            console.error("Erro SQLite:", err);
            throw new Error("Erro ao criar usuário no banco local");
        }

        const { error } = await supabase
            .from('usuario')
            .insert([{
                nomeusuario: dadosUsuario.nomeusuario,
                codusuario: dadosUsuario.codusuario,
                senhausuario: dadosUsuario.senhausuario,
            }])

        if (error) throw new Error("Erro ao criar usuario na nuvem: " + error.message);

    }

    async atualizarUsuario(dadosUsuario: IUsuario): Promise<void> {
        const query = `
            UPDATE usuario SET 
                nomeusuario = ?, 
                dtnascimentousuario = ?, 
                codusuario = ?, 
                senhausuario = ?, 
                cpfusuario = ?
            WHERE sequsuario = ?
        `;
        const parametros = [
            dadosUsuario.nomeusuario,
            dadosUsuario.dtnascimentousuario,
            dadosUsuario.codusuario,
            dadosUsuario.senhausuario,
            dadosUsuario.cpfusuario,
            dadosUsuario.sequsuario
        ];

        try {
            await db.executar(query, parametros);
        } catch (err) {
            console.error("Erro SQLite:", err);
            throw new Error("Erro ao atualizar usuário no banco local");
        }

        const { error } = await supabase
            .from('usuario')
            .update({
                nomeusuario: dadosUsuario.nomeusuario,
                codusuario: dadosUsuario.codusuario,
                senhausuario: dadosUsuario.senhausuario
            })
            .eq('sequsuario', dadosUsuario.sequsuario);

        if (error) throw new Error("Erro ao atualizar usuario na nuvem: " + error.message);
    }

    async deletarUsuario(sequsuario: number): Promise<void> {
        const query = `DELETE FROM usuario WHERE sequsuario = ?`;
        console.log("Deletando usuário com sequsuario:", sequsuario);
        const parametros = [sequsuario];

        try {
            await db.executar(query, parametros);
        } catch (err) {
            console.error("Erro SQLite:", err);
            throw new Error("Erro ao deletar usuário no banco local");
        }

        const { error } = await supabase
            .from('usuario')
            .delete()
            .eq('sequsuario', sequsuario);

        if (error) throw new Error("Erro ao deletar usuario na nuvem: " + error.message);
    }
}

export { UsuarioRepository };
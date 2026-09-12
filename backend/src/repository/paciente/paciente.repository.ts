import bcrypt from "bcrypt";
import IPaciente, { ICadastrarPaciente, IEditarPaciente } from "../../interfaces/paciente/paciente.interface.js";
import { getDatabase } from "../../module/sqlitedb/dbInstance.js";
import { getSupabase } from "../../module/supabase/supabaseInstance.js";
import { AppError } from "../../errors/app.error.js";

const db = getDatabase();
const supabase = getSupabase();

export class PacienteRepository {
    async buscarPacientes(sequsuario: number): Promise<IPaciente[]> {
        const query = `
            SELECT 
                seqpaciente,
                sequsuario,
                nome,
                data_nascimento,
                login,
                senha,
                cpf,
                tel,
                email
            FROM paciente
            WHERE sequsuario = ?
        `;

        const params = [sequsuario];
        const resultado = await db.consultar<IPaciente>(query, params);
        return resultado;
    };

    async buscarPacientePorSeq(seqpaciente: number, sequsuario: number): Promise<IPaciente | null> {
        const query = `
            SELECT 
                seqpaciente,
                sequsuario,
                data_nascimento,
                login,
                senha,
                cpf,
                tel,
                email
            FROM paciente
            WHERE seqpaciente = ? AND sequsuario = ?    
        `;

        return db.consultarUm<IPaciente>(query, [seqpaciente, sequsuario]);
    };

    async buscarPacientePorLogin(login: string, sequsuario: number): Promise<IPaciente | null> {
        const query = `
            SELECT 
                seqpaciente,
                sequsuario,
                data_nascimento,
                login,
                senha,
                cpf,
                tel,
                email
            FROM paciente
            WHERE login = ? AND sequsuario = ?    
        `;

        return db.consultarUm<IPaciente>(query, [login, sequsuario]);
    };

    async buscarPacientePorCpf(cpf: string, sequsuario: number): Promise<IPaciente | null> {
        const query = `
            SELECT 
                seqpaciente,
                sequsuario,
                data_nascimento,
                login,
                senha,
                cpf,
                telefone,
                email
            FROM paciente
            WHERE cpf = ? AND sequsuario = ?    
        `;

        return db.consultarUm<IPaciente>(query, [cpf, sequsuario]);
    };

    async criarPaciente(dadosPaciente: ICadastrarPaciente): Promise<void> {
        const query = `
      INSERT INTO paciente (
        sequsuario,
        nome,
        data_nascimento,
        login,
        senha,
        cpf,
        telefone,
        email
      ) VALUES (?,?,?,?,?,?,?,?)
    `;

        const params = [
            dadosPaciente.sequsuario,
            dadosPaciente.nome,
            dadosPaciente.data_nascimento,
            dadosPaciente.login,
            dadosPaciente.senha,
            dadosPaciente.cpf,
            dadosPaciente.telefone,
            dadosPaciente.email,
        ]

        await db.executar(query, params);

        try {
            const { error } = await supabase.from("pacientes").insert([
                {
                    nome: dadosPaciente.nome,
                    login: dadosPaciente.login,
                    senha: dadosPaciente.senha,
                },
            ]);

            if (error) {
                throw error;
            }
        } catch {
            await db.executar(
                "DELETE FROM paciente WHERE login = ?",
                [dadosPaciente.login]
            );

            throw new AppError(
                "Erro ao sincronizar paciente com o Supabase",
                500,
                "SUPABASE_SYNC_ERROR"
            );
        }
    }

    async atualizarPaciente(dadosPaciente: IEditarPaciente): Promise<void> {
        let query = `
        UPDATE paciente SET 
            nome = ?, 
            data_nascimento = ?, 
            login = ?, 
            cpf = ?,
            telefone = ?,
            email = ?
    `;

        const params: (string | number)[] = [
            dadosPaciente.nome,
            dadosPaciente.data_nascimento,
            dadosPaciente.login,
            dadosPaciente.cpf,
            dadosPaciente.telefone,
            dadosPaciente.email
        ];

        if (dadosPaciente.senha) {
            query += `, senha = ? `;
            params.push(dadosPaciente.senha);
        }

        query += `
        WHERE seqpaciente = ? AND sequsuario = ?
        `;
        params.push(dadosPaciente.seqpaciente, dadosPaciente.sequsuario);

        await db.executar(query, params);

        const { error } = await supabase
            .from("pacientes")
            .update({
                nome: dadosPaciente.nome,
                login: dadosPaciente.login,
                senha: dadosPaciente.senha,
            })
            .eq("login", dadosPaciente.login);

        if (error) {
            throw new AppError(
                "Erro ao sincronizar paciente com o Supabase.",
                500,
                "SUPABASE_SYNC_ERROR"
            );
        }
    }

    async deletarPaciente(sequsuario: number, seqpaciente: number, login: string): Promise<void> {
        const query = `DELETE FROM paciente WHERE seqpaciente = ? AND sequsuario = ?`;
        const params = [seqpaciente, sequsuario];

        await db.executar(query, params);

        const { error } = await supabase
            .from("pacientes")
            .delete()
            .eq("login", login);

        if (error) throw new AppError(
            "Erro ao sincronizar paciente com o Supabase.",
            500,
            "SUPABASE_SYNC_ERROR"
        );
    }
}
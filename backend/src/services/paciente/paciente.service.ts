import bcrypt from "bcrypt";
import { PacienteRepository } from "../../repository/paciente/paciente.repository.js";
import { AppError } from "../../errors/app.error.js";
import { ICadastrarPaciente, IEditarPaciente, ITelaPaciente } from "../../interfaces/paciente/paciente.interface.js";

const pacienteRepo = new PacienteRepository();

export class PacienteService {
    async buscarPacientes(sequsuario: number): Promise<ITelaPaciente[]> {
        const pacientes = await pacienteRepo.buscarPacientes(sequsuario);

        return pacientes.map(paciente => ({
            seqpaciente: paciente.seqpaciente,
            nome: paciente.nome,
            data_nascimento: paciente.data_nascimento,
            login: paciente.login,
            cpf: paciente.cpf,
            telefone: paciente.telefone,
            email: paciente.email,
        }));
    }

    async criarPaciente(dadosPaciente: ICadastrarPaciente): Promise<void> {
        const codExists = await pacienteRepo.buscarPacientePorLogin(dadosPaciente.login, dadosPaciente.sequsuario);
        if (codExists) {
            throw new AppError(
                "Ja existe um paciente com esse login",
                409,
                "LOGIN_ALREADY_EXISTS"
            );
        }

        const cpfExists = await pacienteRepo.buscarPacientePorCpf(dadosPaciente.cpf, dadosPaciente.sequsuario);
        if (cpfExists) {
            throw new AppError(
                "Ja existe um paciente com esse CPF",
                409,
                "CPF_ALREADY_EXISTS"
            );
        }

        const senha = await bcrypt.hash(dadosPaciente.senha, 10);
        dadosPaciente.senha = senha;

        await pacienteRepo.criarPaciente(dadosPaciente);
    }

    async atualizarPaciente(dadosPaciente: IEditarPaciente): Promise<void> {
        const pacienteExists = await pacienteRepo.buscarPacientePorSeq(dadosPaciente.seqpaciente, dadosPaciente.sequsuario);
        if (!pacienteExists) {
            throw new AppError(
                "Paciente não encontrado",
                404,
                "PACIENTE_NOT_FOUND"
            );
        }

        const codExists = await pacienteRepo.buscarPacientePorLogin(dadosPaciente.login, dadosPaciente.sequsuario);
        if (codExists) {
            throw new AppError(
                "Ja existe um paciente com esse login",
                409,
                "LOGIN_ALREADY_EXISTS"
            );
        }

        const cpfExists = await pacienteRepo.buscarPacientePorCpf(dadosPaciente.cpf, dadosPaciente.sequsuario);
        if (cpfExists) {
            throw new AppError(
                "Ja existe um paciente com esse CPF",
                409,
                "CPF_ALREADY_EXISTS"
            );
        }

        let senha = dadosPaciente.senha;

        if (dadosPaciente.senha) {
            senha = await bcrypt.hash(dadosPaciente.senha, 10);
        }
        dadosPaciente.senha = senha;

        await pacienteRepo.atualizarPaciente(dadosPaciente);
    }

    async deletarPaciente(sequsuario: number, seqpaciente: number): Promise<void> {
        const pacienteExists = await pacienteRepo.buscarPacientePorSeq(seqpaciente, sequsuario);
        if (!pacienteExists) {
            throw new AppError(
                "Paciente não encontrado",
                404,
                "PACIENTE_NOT_FOUND"
            );
        }

        let login = pacienteExists.login;

        await pacienteRepo.deletarPaciente(sequsuario, seqpaciente, login);
    }
}

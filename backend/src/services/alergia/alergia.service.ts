import { AppError } from "../../errors/app.error.js";
import type { IAlergia, IAlergiaPaciente } from "@dosely/shared";
import { AlergiaRepository } from "../../repository/alergia/alergia.repository.js";
import { AlergiaPacienteRepository } from "../../repository/alergia/alergia-paciente.repository.js";
import { PacienteRepository } from "../../repository/paciente/paciente.repository.js";

const alergiaRepo = new AlergiaRepository();
const alergiaPacienteRepo = new AlergiaPacienteRepository();
const pacienteRepo = new PacienteRepository();

export class AlergiaService {
    async buscarAlergias(sequsuario: number): Promise<IAlergia[]> {
        return alergiaRepo.buscarAlergias(sequsuario);
    }

    async criarAlergia(descricao: string, sequsuario: number) {
        const descricaoTrim = descricao?.trim();

        if (!descricaoTrim) {
            throw new AppError("Descrição da alergia é obrigatória", 400, "INVALID_ALERGIA");
        }

        const existente = await alergiaRepo.buscarAlergiaPorDescricao(descricaoTrim, sequsuario);
        if (existente) {
            throw new AppError("Alergia já cadastrada", 409, "ALERGIA_ALREADY_EXISTS");
        }

        await alergiaRepo.criarAlergia({ sequsuario, descricao: descricaoTrim });
    }

    async atualizarAlergia(seqalergia: number, descricao: string, sequsuario: number) {
        const alergia = await alergiaRepo.buscarAlergiaPorSeq(seqalergia, sequsuario);
        if (!alergia) {
            throw new AppError("Alergia não encontrada", 404, "ALERGIA_NOT_FOUND");
        }

        const descricaoTrim = descricao?.trim();
        if (!descricaoTrim) {
            throw new AppError("Descrição da alergia é obrigatória", 400, "INVALID_ALERGIA");
        }

        const duplicada = await alergiaRepo.buscarAlergiaPorDescricao(descricaoTrim, sequsuario);
        if (duplicada && duplicada.seqalergia !== seqalergia) {
            throw new AppError("Alergia já cadastrada", 409, "ALERGIA_ALREADY_EXISTS");
        }

        await alergiaRepo.atualizarAlergia({ seqalergia, sequsuario, descricao: descricaoTrim });
    }

    async deletarAlergia(seqalergia: number, sequsuario: number) {
        const alergia = await alergiaRepo.buscarAlergiaPorSeq(seqalergia, sequsuario);
        if (!alergia) {
            throw new AppError("Alergia não encontrada", 404, "ALERGIA_NOT_FOUND");
        }

        await alergiaRepo.deletarAlergia(seqalergia, sequsuario);
    }

    async buscarAlergiasPaciente(seqpaciente: number, sequsuario: number): Promise<IAlergiaPaciente[]> {
        await this.verificarPacienteDoUsuario(seqpaciente, sequsuario);
        return alergiaPacienteRepo.buscarAlergias(seqpaciente);
    }

    async associarAlergia(seqpaciente: number, seqalergia: number, sequsuario: number) {
        await this.verificarPacienteDoUsuario(seqpaciente, sequsuario);

        const alergia = await alergiaRepo.buscarAlergiaPorSeq(seqalergia, sequsuario);
        if (!alergia) {
            throw new AppError("Alergia não encontrada", 404, "ALERGIA_NOT_FOUND");
        }

        const associacao = await alergiaPacienteRepo.buscarAssociacao(seqpaciente, seqalergia);
        if (associacao) {
            throw new AppError("Alergia já associada ao paciente", 409, "ALERGIA_ALREADY_ASSOCIATED");
        }

        await alergiaPacienteRepo.associarAlergia(seqpaciente, seqalergia);
    }

    async desassociarAlergia(seqpaciente: number, seqalergia: number, sequsuario: number) {
        await this.verificarPacienteDoUsuario(seqpaciente, sequsuario);

        const associacao = await alergiaPacienteRepo.buscarAssociacao(seqpaciente, seqalergia);
        if (!associacao) {
            throw new AppError("Associação não encontrada", 404, "ASSOCIATION_NOT_FOUND");
        }

        await alergiaPacienteRepo.desassociarAlergia(seqpaciente, seqalergia);
    }

    private async verificarPacienteDoUsuario(seqpaciente: number, sequsuario: number) {
        const paciente = await pacienteRepo.buscarPacientePorSeq(seqpaciente, sequsuario);
        if (!paciente) {
            throw new AppError("Paciente não encontrado", 404, "PACIENTE_NOT_FOUND");
        }
    }
}
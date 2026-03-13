import { validarCpf } from "@/utils/validarCpf";
import { z } from "zod";

export const usuarioSchema = z.object({
    sequsuario: z.number().optional(),

    nomeusuario: z
        .string().min(1, "*Nome é obrigatório"),

    dtnascimentousuario: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "*Data deve ser no formato AAAA-MM-DD"),

    codusuario: z
        .string().min(1, "*Código é obrigatório")
        .transform((v) => v.toUpperCase()),

    senhausuario: z
        .string().min(8, "*Senha mínimo 8 caracteres"),

    cpfusuario: z.string()
        .min(1, "*CPF é obrigatório")
        .transform((val) => val.replace(/[^\d]+/g, ''))
        .refine(validarCpf, { message: "CPF inválido" }),

    telusuario: z
        .string()
        .transform((val) => val.replace(/[^\d]+/g, ''))
        .refine((val) => val.length >= 10, "*Telefone deve ter no mínimo 10 dígitos")
        .refine((val) => val.length <= 11, "*Telefone deve ter no máximo 11 dígitos"),

    emailusuario: z.string().email("Email inválido").optional().or(z.literal("")),
});

export type UsuarioFormInput = z.input<typeof usuarioSchema>;
export type UsuarioFormOutput = z.output<typeof usuarioSchema>;

export const dadosMedicosSchema = z.object({
    datanascimento: z.string().optional(),
    emailusuario: z.string().email("Email inválido").optional().or(z.literal("")),
    telefoneusuario: z.string().optional(),
    alergias: z.array(z.string()).default([]),
    doencasCronicas: z.array(z.string()).default([]),
    historicoMedico: z.string().optional(),
    observacoes: z.string().optional(),
});

export const medicamentoSchema = z.object({
    id: z.number().optional(),
    nome: z.string().min(1, "Nome do medicamento é obrigatório"),
    dosagem: z.string().min(1, "Dosagem é obrigatória"),
    ativo: z.boolean().default(true),
    horariosExatos: z.array(z.string()).default([]),
    intervaloHoras: z.number().min(1).max(24).optional(),
    horaInicial: z.string().optional(),
    tipoHorario: z.enum(["exato", "intervalo"]).default("exato"),
    periodoTratamento: z.object({
        tipo: z.enum(["continuo", "especifico"]).default("continuo"),
        duracaoDias: z.number().optional(),
        datasEspecificas: z.array(z.string()).default([]),
    }).optional(),
    quantidadeEstoque: z.number().min(0).default(0),
    medicamentosCombo: z.array(z.number()).default([]),
});

export const remedioJudicialSchema = z.object({
    id: z.number().optional(),
    medicamentoId: z.number(),
    ultimaRetirada: z.string(),
    proximaRetirada: z.string().optional(),
    alertaDiasAntes: z.number().default(5),
    alertaDiarioAposVencimento: z.boolean().default(true),
});

export const pacienteSchema = usuarioSchema.merge(dadosMedicosSchema).extend({
    medicamentos: z.array(medicamentoSchema).default([]),
    remediosJudiciais: z.array(remedioJudicialSchema).default([]),
    notificacoesAtivas: z.boolean().default(true),
    observacoesImportantes: z.string().optional(),
});

export const fichaMedicaSchema = z.object({
    sequsuario: z.number(),
    dadosMedicos: dadosMedicosSchema.optional(),
    medicamentos: z.array(medicamentoSchema).optional(),
    remediosJudiciais: z.array(remedioJudicialSchema).optional(),
});

export type PacienteFormInput = z.input<typeof pacienteSchema>;
export type PacienteFormOutput = z.output<typeof pacienteSchema>;

export type MedicamentoFormInput = z.input<typeof medicamentoSchema>;
export type MedicamentoFormOutput = z.output<typeof medicamentoSchema>;

export type FichaMedicaFormInput = z.input<typeof fichaMedicaSchema>;
export type FichaMedicaFormOutput = z.output<typeof fichaMedicaSchema>;
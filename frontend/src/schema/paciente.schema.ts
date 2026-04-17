import { validarCpf } from "@/utils/validarCpf";
import { z } from "zod";

export const pacienteSchema = z.object({
    seqpaciente: z.number().optional(),

    nomepaciente: z
        .string().min(1, "*Nome é obrigatório"),

    dtnascimentopaciente: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "*Data deve ser no formato AAAA-MM-DD"),

    codpaciente: z
        .string().min(1, "*Código é obrigatório")
        .transform((v) => v.toUpperCase()),

    senhapaciente: z
        .string().min(8, "*Senha mínimo 8 caracteres"),

    cpfpaciente: z.string()
        .min(1, "*CPF é obrigatório")
        .transform((val) => val.replace(/[^\d]+/g, ''))
        .refine(validarCpf, { message: "CPF inválido" }),

    telpaciente: z
        .string()
        .transform((val) => val.replace(/[^\d]+/g, ''))
        .refine((val) => val.length >= 10, "*Telefone deve ter no mínimo 10 dígitos")
        .refine((val) => val.length <= 11, "*Telefone deve ter no máximo 11 dígitos"),

    emailpaciente: z.string().email("Email inválido").optional().or(z.literal("")),
});

export type PacienteFormInput = z.input<typeof pacienteSchema>;
export type PacienteFormOutput = z.output<typeof pacienteSchema>;

export const alergiaSchema = z.object({
    seqalergia: z.number().optional(),
    descalergia: z.string().optional(),
});

export const alergiaPacienteSchema = z.object({
    seqpaciente: z.number(),
    seqalergia: z.number(),
    descalergia: z.string(),
});

export type AlergiaFormInput = z.input<typeof alergiaSchema>;
export type AlergiaFormOutput = z.output<typeof alergiaPacienteSchema>;

export const medicamentoSchema = z.object({
    seqmedicamento: z.number().optional(),
    nomemedicamento: z.string().optional(),
    descmedicamento: z.string().optional(),
    dosagem: z.string().optional(),
});

export type MedicamentoFormInput = z.input<typeof medicamentoSchema>;
export type MedicamentoFormOutput = z.output<typeof medicamentoSchema>;
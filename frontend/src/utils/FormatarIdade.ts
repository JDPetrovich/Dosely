import { format, parseISO } from "date-fns";

export function formatarDataNascimento(data: string) {
    if (!data) return "";
    const nascimento = parseISO(data);
    return format(nascimento, "dd/MM/yyyy");
}
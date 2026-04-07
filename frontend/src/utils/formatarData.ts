import { format, parseISO } from "date-fns";

export function formatarDataHora(dateString?: string): string {
    if (!dateString) {
        return '';
    }

    try {
        const date = new Date(dateString);

        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };

        return date.toLocaleString('pt-BR', options);

    } catch (e) {
        return 'Data inválida';
    }
}

export function formatarDataStrIso8601(dateString: string): string {
    if (!dateString) { return ""; }
    if (dateString.length !== 10) { return ""; }

    const dataDividida = dateString.split("/");
    if (dataDividida[0].length !== 2) { return ""; }
    if (dataDividida[1].length !== 2) { return ""; }
    if (dataDividida[2].length !== 4) { return ""; }

    const dia = dataDividida[0];
    const mes = dataDividida[1];
    const ano = dataDividida[2];
    return `${ano}-${mes}-${dia}`;
}

export function formatarDataNascimento(data: string) {
    if (!data) return "";
    const nascimento = parseISO(data);
    return format(nascimento, "dd/MM/yyyy");
}
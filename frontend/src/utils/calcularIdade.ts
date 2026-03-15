export function calcularIdade(dataNascimento: string) {
    const hoje = new Date();

    const [ano, mes, dia] = dataNascimento.split("-").map(Number);
    const nascimento = new Date(ano, mes - 1, dia);

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const diffMes = hoje.getMonth() - nascimento.getMonth();

    if (diffMes < 0 || (diffMes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }

    return idade;
}
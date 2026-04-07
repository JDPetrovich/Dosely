export function formatarCPF(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
}

export function formatarTelefone(value: string) {
    if (!value) return "";
    const nums = value.replace(/\D/g, "");

    if (nums.length <= 10) {
        return nums.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    }
    return nums.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

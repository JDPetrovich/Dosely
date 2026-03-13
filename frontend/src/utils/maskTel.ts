export function maskTelefone(value: string) {
    if (!value) return "";
    const nums = value.replace(/\D/g, "");

    if (nums.length <= 10) {
        return nums.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    }
    return nums.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}
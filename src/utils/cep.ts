export function onlyDigits(value: string): string {
    return value.replace(/\D+/g, "");
}

export function isValidCEP(cep: string): boolean {
    return onlyDigits(cep).length === 8;
}
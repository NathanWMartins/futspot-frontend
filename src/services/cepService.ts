import { onlyDigits } from "../utils/cep";

export type CepResponse = {
    logradouro?: string;
    bairro?: string;
    localidade?: string;
    uf?: string;
    erro?: boolean;
};

export async function fetchAddressByCep(cep: string): Promise<CepResponse> {
    const cleanCep = onlyDigits(cep);

    if (cleanCep.length !== 8) {
        throw new Error("CEP inválido");
    }

    const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (!res.ok) {
        throw new Error("Erro ao consultar CEP");
    }

    const data: CepResponse = await res.json();

    if (data.erro) {
        throw new Error("CEP não encontrado");
    }

    return data;
}

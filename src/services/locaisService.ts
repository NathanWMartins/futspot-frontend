import { api } from "./api";

export type TipoLocal = "society" | "futsal" | "campo";

export type LocalApi = {
    id: number;
    nome: string;
    descricao?: string | null;
    endereco: string;
    tipoLocal: TipoLocal;
    precoHora: number;
    fotos: string[];
    createdAt: string;
    donoId: number;
};

export async function listarMeusLocais(): Promise<LocalApi[]> {
    const { data } = await api.get<LocalApi[]>("/locais");
    return Array.isArray(data) ? data : [];
}

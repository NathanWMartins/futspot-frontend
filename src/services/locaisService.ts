import type { LocalCardDTO, Modalidade } from "../types/local";
import { api } from "./api";

export type LocalApi = {
    id: number;
    nome: string;
    descricao?: string | null;
    endereco: string;
    tipoLocal: Modalidade;
    precoHora: number;
    fotos: string[];
    createdAt: string;
    donoId: number;
};

export async function listarMeusLocais(): Promise<LocalApi[]> {
    const { data } = await api.get<LocalApi[]>("/locais");
    return Array.isArray(data) ? data : [];
}

export async function listarCidadesComLocais(): Promise<string[]> {
    const { data } = await api.get<string[]>("/locais/cidades");
    return data ?? [];
}

export async function listarLocaisPorCidade(params: {
    cidade: string;
    modalidade?: Exclude<Modalidade, "todos">;
}): Promise<LocalCardDTO[]> {
    const { cidade, modalidade } = params;

    const query: Record<string, string> = { cidade };
    if (modalidade) query.modalidade = modalidade;

    const { data } = await api.get<LocalCardDTO[]>("/locais", { params: query });
    return data ?? [];
}
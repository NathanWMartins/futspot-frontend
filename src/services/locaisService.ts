import type { LocalCardDTO, Modalidade, SearchFilters } from "../types/local";
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

// Funções Locador
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

// Funções Jogador
export async function searchLocais(
  filters: SearchFilters
): Promise<LocalCardDTO[]> {
  const params: Record<string, string> = {};

  if (filters.cidade) params.cidade = filters.cidade;
  if (filters.data) params.data = filters.data;

  if (filters.tipos?.length) params.tipos = filters.tipos.join(",");
  if (filters.periodos?.length) params.periodos = filters.periodos.join(",");

  const { data } = await api.get<LocalCardDTO[]>("/locais/search", { params });
  return data;
}
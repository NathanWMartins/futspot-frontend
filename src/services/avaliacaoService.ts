import { api } from "./api";

export type CriarAvaliacaoRequest = {
  agendamentoId: number;
  nota: number;
  comentario?: string | null;
};

export async function criarAvaliacao(payload: CriarAvaliacaoRequest) {
  const res = await api.post("/avaliacoes", payload);
  return res.data;
}

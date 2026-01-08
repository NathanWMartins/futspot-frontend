import { api } from "./api";

export type CriarAgendamentoRequest = {
  localId: number;
  data: string;  
  inicio: string;
};

export type AgendamentoResponse = {
  id: number;
  localId: number;
  jogadorId: number;
  data: string;
  inicio: string;
  status: "confirmado" | "cancelado";
  createdAt: string;
};

export async function criarAgendamento(payload: CriarAgendamentoRequest) {
  const res = await api.post<AgendamentoResponse>("/agendamentos", payload);
  return res.data;
}

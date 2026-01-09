import type {
  AgendamentoResponse,
  AgendaResponse,
  CriarAgendamentoRequest,
} from "../types/agendamento";
import { api } from "./api";

export async function criarAgendamento(payload: CriarAgendamentoRequest) {
  const res = await api.post<AgendamentoResponse>("/agendamentos", payload);
  return res.data;
}

export async function getMinhaAgenda() {
  const res = await api.get<AgendaResponse>("/agendamentos/me");
  return res.data;
}

export async function cancelarAgendamento(id: number) {
  const res = await api.delete(`/agendamentos/${id}`);
  return res.data;
}
import { api } from "./api";

export type Mensalidade = {
  id: number;
  nomeResponsavel: string;
  localId: number;
  cpf: string;
  celular: string;
  diaSemana: number;
  horaInicio: string;
  valor: number;
};

export async function getMensalidadesPorLocal(localId: number) {
  const res = await api.get<Mensalidade[]>(`/mensalidades/local/${localId}`);
  return res.data;
}

export async function createMensalidade(data: Omit<Mensalidade, "id">) {
  const res = await api.post<Mensalidade>("/mensalidades", data);
  return res.data;
}

export async function updateMensalidade(
  id: number,
  data: Omit<Mensalidade, "id">,
) {
  const res = await api.patch<Mensalidade>(`/mensalidades/${id}/update`, data);
  return res.data;
}

export async function deleteMensalidade(id: number) {
  const res = await api.delete(`/mensalidades/${id}`);
  return res.data;
}
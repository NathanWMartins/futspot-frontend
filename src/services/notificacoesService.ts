import { api } from "./api";

export async function getNotificacoesNaoLidasCount(): Promise<number> {
  const { data } = await api.get("/notificacoes/nao-lidas");
  return data.total;
}

import { api } from "./api";

export async function getNotificacoesNaoLidasCount(): Promise<number> {
  const { data } = await api.get<number>("/notificacoes/nao-lidas-numero");
  return data;
}


export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  criadaEm: string;
  lida: boolean;
  tipo: 'AGENDAMENTO_SOLICITADO' | 'AGENDAMENTO_ACEITO' | 'AGENDAMENTO_REJEITADO' | 'AGENDAMENTO_CANCELADO' | 'AGENDAMENTO_RECUSADO';
  dataAgendamento?: string;
  horaAgendamento?: string;
  jogador?: {
    id: string;
    nome: string;
    fotoUrl?: string;
  };

  local?: {
    id: string;
    nome: string;
    fotoUrl?: string;
  };
}

export async function getNotificacoesNaoLidas(): Promise<Notificacao[]> {
  const { data } = await api.get<Notificacao[]>("/notificacoes/nao-lidas");
  return data;
}

export async function getNotificacoesLidas(): Promise<Notificacao[]> {
  const { data } = await api.get<Notificacao[]>("/notificacoes/lidas");
  return data;
}

export async function marcarNotificacaoComoLida(id: string): Promise<void> {
  await api.patch(`/notificacoes/${id}/marcar-como-lida`);
}

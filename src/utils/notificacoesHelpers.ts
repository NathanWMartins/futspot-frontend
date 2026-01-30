import type { TipoUsuario } from "../services/authService";
import type { Notificacao } from "../services/notificacoesService";

export function getNavigatePath(
  n: Notificacao,
  perfil: TipoUsuario | undefined,
) {
  if (!n.dataAgendamento || !n.horaAgendamento) return null;
  
  if (perfil === "locador") {
    if (n.tipo === "AGENDAMENTO_SOLICITADO") {
      return `/locador/agenda?localId=${n.local?.id}&data=${n.dataAgendamento}&hora=${n.horaAgendamento}`;
    }else if(n.tipo === "AGENDAMENTO_CANCELADO"){
      return `/locador/jogador/${n.jogador?.id}`
    }
    return null;
  }
  
  if (perfil === "jogador") {
    if (n.tipo === "AGENDAMENTO_ACEITO") {
      return `/jogador/agenda`;
    }
    return null;
  }

  return null;
}

export function normalizeHora(hora: string) {
  return hora.slice(0, 5);
}

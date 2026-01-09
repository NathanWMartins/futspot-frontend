export type StatusAgendamento = "confirmado" | "cancelado";

export type AvaliacaoDTO = {
    id: number;
    nota: number;
    comentario?: string | null;
} | null;

export type AgendamentoCardDTO = {
    id: number;
    localId: number;
    localNome: string;
    localFotoUrl?: string | null;
    endereco?: string | null;
    data: string;
    inicio: string;
    status: StatusAgendamento;
    podeAvaliar: boolean;
    avaliacao?: AvaliacaoDTO;
};

export type AgendaResponse = {
    proximos: AgendamentoCardDTO[];
    historico: AgendamentoCardDTO[];
};

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
export type Modalidade = "todos" | "society" | "futsal" | "campo";
export type PeriodoDia = "manha" | "tarde" | "noite";
export type SlotDTO = { inicio: string; fim: string; status: "livre" | "ocupado" };

export type DisponibilidadeDTO = {
  fechado: boolean;
  slots: SlotDTO[];
};

export type HorarioFuncionamentoDTO = {
  diaSemana: number;
  aberto: boolean;
  inicio: string | null;
  fim: string | null;
};

export type LocalCardDTO = {
  id: number;
  nome: string;
  fotoUrl?: string | null;
  descricao?: string | null;
  endereco?: string | null;
  cidade?: string | null;
  tipoLocal?: Modalidade;
  precoHora?: number | null;

  rating?: number | null;
  totalAvaliacoes?: number | null;
  horarios?: HorarioFuncionamentoDTO[];
};

export type SearchFilters = {
  cidade: string | null;
  tipos: Modalidade[];
  periodos: PeriodoDia[];
  data: string;
};

export function modalidadeLabel(m: Exclude<Modalidade, "todos">) {
  if (m === "society") return "Society";
  if (m === "futsal") return "Futsal";
  return "Campo";
}

export const TIPOS_QUADRA: Array<{ key: Modalidade; label: string }> = [
  { key: "society", label: "Society" },
  { key: "futsal", label: "Futsal" },
  { key: "campo", label: "Campo" },
];

export const PERIODOS: Array<{ key: PeriodoDia; label: string }> = [
  { key: "manha", label: "Manhã" },
  { key: "tarde", label: "Tarde" },
  { key: "noite", label: "Noite" },
];

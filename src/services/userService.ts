import { api } from "./api";
import type { AuthUser } from "./authService";

export type UpdateMePayload = {
  nome?: string;
  senha?: string;
  telefone?: string;
  fotoUrl?: string | null;
  email?: string | null;
};

type UpdateMeResponse = {
  user: AuthUser;
};

export type BaseStats = {
  createdAt: string;
};

export type UserStatsResponse = BaseStats & {
  createdAt: string;
  totalReservas: number;
  locaisDiferentes: number;
};

export type LocadorStatsResponse = BaseStats & {
  totalQuadras: number;
  totalReservas: number;
  totalFaturamento: number;
  createdAt: string;
};

export async function atualizarPerfil(
  payload: UpdateMePayload
): Promise<AuthUser> {
  const { data } = await api.put<UpdateMeResponse>("/user/update/me", payload);
  return data.user;
}

export async function uploadFotoPerfil(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post<{ url: string }>(
    "/user/uploads/foto-perfil",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return data.url;
}

export async function getJogadorStats(): Promise<UserStatsResponse> {
  const { data } = await api.get<UserStatsResponse>("/user/jogador/me/stats");
  return data;
}

export async function getLocadorStats(): Promise<LocadorStatsResponse> {
  const { data } = await api.get<LocadorStatsResponse>(
    "/user/locador/me/stats"
  );
  return data;
}

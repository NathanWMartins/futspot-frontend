import { api } from "./api";

export type TipoUsuario = "jogador" | "locador";

export type AuthUser = {
  id: number;
  nome?: string;
  email: string;
  telefone?: string;
  tipoUsuario: TipoUsuario;
  fotoUrl?: string | null;
};

export type AuthResponse = {
  user: AuthUser;
  access_token?: string;
  token?: string;
};

export async function loginRequest(params: {
  email: string;
  senha: string;
  tipoUsuario: TipoUsuario;
}): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", params);
  return data;
}

export async function registerRequest(params: {
  nome: string;
  email: string;
  senha: string;
  tipoUsuario: TipoUsuario;
}): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/register", params);
  return data;
}

export async function verifyEmailRequest(params: {
  email: string;
  codigo: string;
}): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/verify-email", params);
  return data;
}

export function extractToken(data: AuthResponse): string | null {
  return data.access_token ?? data.token ?? null;
}

type RedefinirSenhaResponse = {
  message: string;
};

export function redefinirSenhaRequest(params: {
  email: string;
}): Promise<RedefinirSenhaResponse> {
  return api
    .post<RedefinirSenhaResponse>("/auth/redefinir-senha", params)
    .then((response) => response.data);
}

type ResetPasswordConfirmParams = {
  token: string;
  password: string;
  confirmPassword: string;
};

export function resetPasswordConfirm(
  params: ResetPasswordConfirmParams,
): Promise<{ message: string }> {
  return api
    .post("/auth/redefinir-senha/confirm", params)
    .then((res) => res.data);
}

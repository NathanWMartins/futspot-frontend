import { api } from "./api";

export type TipoUsuario = "jogador" | "locador";

export type AuthUser = {
    id: number;
    nome?: string;
    email: string;
    tipoUsuario: TipoUsuario;
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

export function extractToken(data: AuthResponse): string | null {
    return data.access_token ?? data.token ?? null;
}

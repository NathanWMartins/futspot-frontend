export type UserDTO = {
    id: number;
    nome: string;
    email: string;
    telefone?: string;
    cidade?: string;
    fotoUrl?: string;
    tipoUsuario: "jogador" | "locador";
}
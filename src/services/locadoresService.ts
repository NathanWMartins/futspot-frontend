import { api } from "./api";

export type OcupacaoItem = {
    localId: number;
    fechado: boolean;
    ocupados: number;
    totalSlots: number;
};

export type OcupacaoResponse = {
    data: string;
    itens: OcupacaoItem[];
};

export type TipoLocal = "society" | "futsal" | "campo";

export type Local = {
    id: number;
    nome: string;
    descricao: string;
    endereco: string;
    cidade: string;
    cep: string;
    numero: string;
    tipoLocal: TipoLocal;
    precoHora: number;
    fotos: string[];
    horarios: any[];
    donoId: number;
    createdAt: string;
};

export type LocalPayload = {
    nome: string;
    descricao?: string;
    cep: string;
    cidade: string;
    endereco: string;
    numero: string;
    tipoLocal: TipoLocal;
    precoHora: number;
    fotos: string[];
    horarios: any[];
};

export async function getOcupacaoDoDia(dataISO: string): Promise<OcupacaoResponse> {
    const { data } = await api.get<OcupacaoResponse>("/locadores/me/ocupacao", {
        params: { data: dataISO },
    });

    return data;
}

export async function uploadFoto(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post<{ url: string }>("/uploads/foto", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return data.url;
}

export async function criarLocal(payload: LocalPayload): Promise<Local> {
    console.log("payload create:", payload);
    const { data } = await api.post<Local>("/locais", payload);
    return data;
}

export async function atualizarLocal(id: number, payload: LocalPayload): Promise<Local> {
    console.log("payload update:", payload);
    const { data } = await api.put<Local>(`/locais/${id}`, payload);
    return data;
}

export type IbgeMunicipio = {
  id: number;
  nome: string;
};

const IBGE_MUNICIPIOS_URL =
  "https://servicodados.ibge.gov.br/api/v1/localidades/municipios";

export async function fetchMunicipiosIBGE(signal?: AbortSignal): Promise<IbgeMunicipio[]> {
  const res = await fetch(IBGE_MUNICIPIOS_URL, { signal });
  if (!res.ok) throw new Error("Falha ao buscar municípios do IBGE");
  return res.json();
}

export function formatarDataBR(data: string) {
    const d = new Date(data.length === 10 ? `${data}T00:00:00` : data);
    if (isNaN(d.getTime())) return data;

    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const ano = d.getFullYear();

    return `${dia}/${mes}/${ano}`;
}

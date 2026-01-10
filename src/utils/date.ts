export function formatarDataBR(data: string) {
    const d = new Date(data.length === 10 ? `${data}T00:00:00` : data);
    if (isNaN(d.getTime())) return data;

    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const ano = d.getFullYear();

    return `${dia}/${mes}/${ano}`;
}

export function tempoNoApp(createdAtISO: string) {
    const created = new Date(createdAtISO);
    const now = new Date();
    const months =
        (now.getFullYear() - created.getFullYear()) * 12 + (now.getMonth() - created.getMonth());

    if (!Number.isFinite(months) || months < 0) return "Novo";
    if (months < 1) return "Novo";
    if (months === 1) return "1 mês";
    if (months < 12) return `${months} meses`;

    const years = Math.floor(months / 12);
    return years === 1 ? "1 ano" : `${years} anos`;
}

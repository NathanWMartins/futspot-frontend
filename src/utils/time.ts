export function normalizeHHMM(time: string) {
    return time.slice(0, 5);
}

export function toMinutes(hhmm: string) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
}

export function fromMinutes(min: number) {
    const h = String(Math.floor(min / 60)).padStart(2, "0");
    const m = String(min % 60).padStart(2, "0");
    return `${h}:${m}`;
}

export function getDiaSemanaFromISODate(isoDate: string) {
    return new Date(`${isoDate}T00:00:00`).getDay();
}

export function buildHourlySlots(inicio: string, fim: string) {
    const start = toMinutes(normalizeHHMM(inicio));
    const end = toMinutes(normalizeHHMM(fim));

    const slots: string[] = [];
    for (let t = start; t + 60 <= end; t += 60) {
        slots.push(fromMinutes(t));
    }
    return slots;
}

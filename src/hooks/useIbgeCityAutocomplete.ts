import { useCallback, useRef, useState } from "react";
import { fetchMunicipiosIBGE, type IbgeMunicipio } from "../services/ibgeService";

function normalize(s: string) {
    return s
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

export function useIbgeCityAutocomplete(minChars = 3, limit = 12) {
    const cacheRef = useRef<string[] | null>(null);
    const [loading, setLoading] = useState(false);

    const ensureLoaded = useCallback(async () => {
        if (cacheRef.current) return;

        setLoading(true);
        try {
            const data: IbgeMunicipio[] = await fetchMunicipiosIBGE();
            cacheRef.current = data.map((m) => m.nome);
        } finally {
            setLoading(false);
        }
    }, []);

    const filterCities = useCallback(
        (query: string) => {
            const q = normalize(query);
            if (!cacheRef.current || q.length < minChars) return [];

            const starts: string[] = [];
            const includes: string[] = [];

            for (const nome of cacheRef.current) {
                const n = normalize(nome);
                if (n.startsWith(q)) starts.push(nome);
                else if (n.includes(q)) includes.push(nome);
            }

            const out = [...starts, ...includes];
            return out.slice(0, limit);
        },
        [minChars, limit]
    );

    return { ensureLoaded, filterCities, loading };
}

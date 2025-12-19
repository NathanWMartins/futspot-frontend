import { Box, Typography } from "@mui/material";

export function SlotTile({ inicio, fim, status, onSelect }:
    {
        inicio: string; fim: string; status: "livre" | "ocupado";
        onSelect: () => void;
    }) {
    const isLivre = status === "livre";

    return (
        <>
            <Box
                onClick={onSelect}
                sx={{
                    borderRadius: 2,
                    p: 1,
                    minHeight: 56,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    border: "1px solid rgba(255,255,255,0.08)",
                    bgcolor: isLivre ? "rgba(0,230,118,0.14)" : "rgba(255,82,82,0.14)",
                    color: isLivre ? "#00E676" : "#ff5252",
                    transition: "transform .12s ease, filter .12s ease",
                    "&:hover": {
                        transform: "translateY(-2px)",
                        filter: "brightness(1.1)",
                    },
                }}

            >
                <Typography sx={{ fontWeight: 900, fontSize: 14 }}>
                    {inicio}
                </Typography>
                <Typography sx={{ fontSize: 11, opacity: 0.8 }}>
                    {fim}
                </Typography>
            </Box>
        </>
    );
}

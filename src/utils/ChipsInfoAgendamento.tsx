import { Chip } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";

export function chipLivre() {
    return (
        <Chip
            size="small"
            icon={<CheckCircleRoundedIcon />}
            label="Livre"
            sx={{ bgcolor: "rgba(0,230,118,0.14)", color: "#00E676" }}
        />
    );
}
export function chipOcupado() {
    return (
        <Chip
            size="small"
            icon={<EventBusyRoundedIcon />}
            label="Ocupado"
            sx={{ bgcolor: "rgba(255,82,82,0.14)", color: "#ff5252" }}
        />
    );
}
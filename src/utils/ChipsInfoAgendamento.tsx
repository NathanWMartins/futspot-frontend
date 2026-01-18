import { Chip } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";

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

export function chipSolicitado() {
    return (
        <Chip
            size="small"
            icon={<HourglassTopRoundedIcon />}
            label="Solicitado"
            sx={{ bgcolor: "rgba(255,82,82,0.14)", color: "#ffbb00" }}
        />
    );
}
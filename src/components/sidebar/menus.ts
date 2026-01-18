import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import type { SvgIconComponent } from "@mui/icons-material";

export interface MenuItem {
  label: string;
  path: string;
  icon: SvgIconComponent;
}

export const jogadorMenu: MenuItem[] = [
  { label: "Início", path: "/jogador/home", icon: HomeIcon, },
  { label: "Agenda", path: "/jogador/agenda", icon: CalendarMonthIcon, },
];

export const locadorMenu: MenuItem[] = [
  { label: "Início", path: "/locador/home", icon: HomeIcon, },
  { label: "Locais", path: "/locador/locais", icon: PlaceOutlinedIcon, },
  { label: "Agenda", path: "/locador/agenda", icon: CalendarMonthIcon, },
];

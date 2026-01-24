import { Box, Typography, Badge } from "@mui/material";
import type { SvgIconComponent } from "@mui/icons-material";

interface SidebarItemProps {
  icon: SvgIconComponent;
  label: string;
  active?: boolean;
  open: boolean;
  badgeCount?: number;
  onClick: () => void;
}

export function SidebarItem({
  icon: Icon,
  label,
  active = false,
  open,
  badgeCount,
  onClick,
}: SidebarItemProps) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 2,
        py: 1.2,
        borderRadius: 1,
        cursor: "pointer",
        color: active ? "#00E676" : "rgba(255,255,255,0.75)",
        bgcolor: active ? "rgba(0,230,118,0.12)" : "transparent",
        "&:hover": {
          bgcolor: "rgba(255,255,255,0.06)",
        },
      }}
    >
      <Badge
        badgeContent={badgeCount}
        color="error"
        overlap="circular"
        invisible={!badgeCount}
        sx={{
          "& .MuiBadge-badge": {
            fontSize: 10,
            height: 16,
            minWidth: 16,
          },
        }}
      >
        <Icon
          sx={{
            fontSize: 20,
          }}
        />
      </Badge>

      {open && (
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </Typography>
      )}
    </Box>
  );
}

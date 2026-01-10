import {
  Avatar,
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import type { UserDTO } from "../../../types/perfil";

function getInitials(nome?: string) {
  if (!nome) return "U";
  const parts = nome.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "U";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (a + b).toUpperCase();
}

type Props = {
  user: UserDTO;
  onEdit: () => void;
};

export default function ProfileHeaderCard({ user, onEdit }: Props) {
  return (
    <Card
      sx={{
        borderRadius: 2,
        bgcolor: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" spacing={1.6} alignItems="center">
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={user.fotoUrl ?? undefined}
              sx={{
                width: 60,
                height: 60,
                bgcolor: "rgba(0,230,118,0.16)",
                border: "2px solid rgba(0,230,118,0.35)",
                fontWeight: 900,
              }}
            >
              {getInitials(user.nome)}
            </Avatar>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 900, fontSize: 18 }} noWrap>
              {user.nome}
            </Typography>
            <Typography sx={{ opacity: 0.75, fontSize: 13 }} noWrap>
              {user.email}
            </Typography>

            <Box
              sx={{
                mt: 1,
                display: "inline-flex",
                px: 1.1,
                py: 0.35,
                borderRadius: 999,
                bgcolor: "rgba(0,230,118,0.16)",
                border: "1px solid rgba(0,230,118,0.28)",
                fontWeight: 900,
                fontSize: 12,
              }}
            >
              Jogador
            </Box>
          </Box>

          <EditRoundedIcon onClick={onEdit}
            sx={{
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 900,
              width: 40,
              bgcolor: "rgba(0,230,118,0.16)",
              border: "1px solid rgba(0,230,118,0.28)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(0,230,118,0.22)" },
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

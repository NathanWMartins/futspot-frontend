import {
  Card,
  CardContent,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
// import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

type Props = {
  onOpenDados: () => void;
  onOpenSenha: () => void;
  onLogout: () => void;
  onDelete: () => void;
};

function Row({
  icon,
  title,
  subtitle,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <ListItemButton
      onClick={onClick}
      sx={{
        py: 1.1,
        borderRadius: 2.5,
        "&:hover": { bgcolor: "rgba(255,255,255,0.04)" },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 38,
          color: danger ? "error.main" : "rgba(255,255,255,0.85)",
        }}
      >
        {icon}
      </ListItemIcon>

      <ListItemText
        primary={
          <Typography
            sx={{ fontWeight: 900, color: danger ? "error.main" : "#fff" }}
          >
            {title}
          </Typography>
        }
        secondary={
          subtitle ? (
            <Typography sx={{ opacity: 0.7, fontSize: 12 }}>
              {subtitle}
            </Typography>
          ) : null
        }
      />

      <ChevronRightRoundedIcon sx={{ opacity: 0.5 }} />
    </ListItemButton>
  );
}

export default function ContaSection({
  onOpenDados,
  onOpenSenha,
  onLogout,
  // onDelete,
}: Props) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        bgcolor: "rgba(4, 4, 4, 0.3)",
      }}
    >
      <CardContent sx={{ p: 1.25 }}>
        <List disablePadding sx={{ display: "grid", gap: 0.5 }}>
          <Row
            icon={<Person2OutlinedIcon />}
            title="Dados pessoais"
            subtitle="Nome, telefone e cidade"
            onClick={onOpenDados}
          />
          <Row
            icon={<HttpsOutlinedIcon />}
            title="Senha"
            subtitle="Alterar senha da conta"
            onClick={onOpenSenha}
          />

          <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", my: 0.75 }} />

          <Row
            icon={<LogoutRoundedIcon />}
            title="Sair"
            subtitle="Encerrar sessão"
            onClick={onLogout}
          />
          {/* <Row
            icon={<DeleteOutlineRoundedIcon />}
            title="Excluir conta"
            subtitle="Ação irreversível"
            onClick={onDelete}
            danger
          /> */}
        </List>
      </CardContent>
    </Card>
  );
}

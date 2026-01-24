import { Alert, Box, Snackbar, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import BottomNavLocador from "../../components/locador/BottomNavLocador";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { locadorMenu } from "../../components/sidebar/menus";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { getNotificacoesNaoLidasCount } from "../../services/notificacoesService";

export default function LocadorLayout() {
  const isMobile = useMediaQuery("(max-width:900px)");
  const { user } = useAuth();
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(0);
  const [snack, setSnack] = useState<{
    open: boolean;
    msg: string;
    severity: "success" | "error";
  }>({
    open: false,
    msg: "",
    severity: "success",
  });
  const showError = (msg: string) =>
    setSnack({ open: true, msg, severity: "error" });

  useEffect(() => {
    try {
      getNotificacoesNaoLidasCount().then((count) =>
        setNotificacoesNaoLidas(count),
      );
    } catch (err) {
      console.error(err);
      showError("Erro ao salvar perfil.");
    }
  }, []);

  return (
    <>
      <Box sx={{ minHeight: "100vh", bgcolor: "#121212" }}>
        {!isMobile && (
          <Sidebar
            menu={locadorMenu(notificacoesNaoLidas)}
            user={{
              nome: user?.nome ?? "User",
              fotoUrl: user?.fotoUrl ?? "",
              tipoUsuario: user?.tipoUsuario ?? "",
            }}
          />
        )}

        <Box sx={{ pb: isMobile ? 8 : 0 }}>
          <Outlet />
        </Box>

        {isMobile && <BottomNavLocador />}
      </Box>
      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  );
}

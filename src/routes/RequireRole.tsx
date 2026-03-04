import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { TipoUsuario } from "../services/authService";

interface Props {
  role: TipoUsuario;
}

export function RequireRole({ role }: Props) {
  const { user } = useAuth();

  if (!user) {
    alert("Você precisa estar logado.");
    return <Navigate to="/" replace />;
  }

  if (user.tipoUsuario !== role) {
    alert(`Você não tem permissão para acessar esta página. Tipo de usuário necessário: ${role}`);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
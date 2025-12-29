import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RequireAuth() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/"
                replace
                state={{
                    snackbar: {
                        severity: "error",
                        message: "Faça login para acessar essa página.",
                    },
                    from: location.pathname,
                }}
            />
        );
    }

    return <Outlet />;
}

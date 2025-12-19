import React, { createContext, useContext, useMemo, useState } from "react";
import type { AuthUser } from "../services/authService";

type AuthContextType = {
    user: AuthUser | null;
    token: string | null;
    signIn: (payload: { user: AuthUser; token: string | null }) => void;
    signOut: () => void;
    isAuthenticated: boolean;
};

const LS_TOKEN = "futspot_token";
const LS_USER = "futspot_user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem(LS_TOKEN));
    const [user, setUser] = useState<AuthUser | null>(() => {
        const raw = localStorage.getItem(LS_USER);
        return raw ? JSON.parse(raw) : null;
    });

    const signIn: AuthContextType["signIn"] = ({ user, token }) => {
        setUser(user);
        setToken(token);

        localStorage.setItem(LS_USER, JSON.stringify(user));
        if (token) localStorage.setItem(LS_TOKEN, token);
        else localStorage.removeItem(LS_TOKEN);
    };

    const signOut = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem(LS_USER);
        localStorage.removeItem(LS_TOKEN);
    };

    const value = useMemo(
        () => ({ user, token, signIn, signOut, isAuthenticated: !!token }),
        [user, token]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}

import { createContext, useContext, useState } from "react";
import { getNotificacoesNaoLidasCount } from "../services/notificacoesService";

type NotificacaoContextType = {
  naoLidasCount: number;
  setNaoLidasCount: (n: number) => void;
  reloadNaoLidasCount: () => Promise<void>;
};

const NotificacaoContext = createContext<NotificacaoContextType>(
  {} as NotificacaoContextType,
);

export function NotificacaoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [naoLidasCount, setNaoLidasCount] = useState(0);

  const reloadNaoLidasCount = async () => {
    const count = await getNotificacoesNaoLidasCount();
    setNaoLidasCount(count);
  };

  return (
    <NotificacaoContext.Provider
      value={{ naoLidasCount, setNaoLidasCount, reloadNaoLidasCount }}
    >
      {children}
    </NotificacaoContext.Provider>
  );
}

export const useNotificacao = () => useContext(NotificacaoContext);

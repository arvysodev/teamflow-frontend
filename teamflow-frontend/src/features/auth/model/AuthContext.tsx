import { createContext, useContext, useState, type PropsWithChildren } from "react";

import { getAccessToken, setAccessToken, clearAccessToken } from "@/shared/lib/token";

type AuthContextValue = {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAccessToken());

  function login(token: string) {
    setAccessToken(token);
    setIsAuthenticated(true);
  }

  function logout() {
    clearAccessToken();
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}

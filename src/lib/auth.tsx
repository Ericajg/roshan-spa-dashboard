import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { USUARIOS, type Usuario } from "./mock-data";

const STORAGE_KEY = "roshan.sesion";

type AuthValue = {
  usuario: Usuario | null;
  listo: boolean;
  iniciarSesion: (usuario: string, password: string) => boolean;
  cerrarSesion: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    try {
      const id = window.localStorage.getItem(STORAGE_KEY);
      const encontrado = id ? USUARIOS.find((u) => u.id === id) : undefined;
      if (encontrado) setUsuario(encontrado);
    } catch {
      // almacenamiento no disponible
    }
    setListo(true);
  }, []);

  const iniciarSesion = useCallback((nombreUsuario: string, password: string) => {
    const encontrado = USUARIOS.find(
      (u) => u.usuario.toLowerCase() === nombreUsuario.trim().toLowerCase() && u.password === password,
    );
    if (!encontrado) return false;
    setUsuario(encontrado);
    try {
      window.localStorage.setItem(STORAGE_KEY, encontrado.id);
    } catch {
      // almacenamiento no disponible
    }
    return true;
  }, []);

  const cerrarSesion = useCallback(() => {
    setUsuario(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // almacenamiento no disponible
    }
  }, []);

  const value = useMemo(
    () => ({ usuario, listo, iniciarSesion, cerrarSesion }),
    [usuario, listo, iniciarSesion, cerrarSesion],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}

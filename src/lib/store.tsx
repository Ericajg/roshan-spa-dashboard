import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ATENCIONES,
  BLOQUEOS_HORARIO,
  CLIENTES,
  HORAS,
  PAGOS,
  SERVICIOS,
  TURNOS,
  sumarMinutos,
  type Atencion,
  type BloqueoHorario,
  type Cliente,
  type EstadoTurno,
  type MedioPago,
  type Pago,
  type Servicio,
  type TipoPago,
  type Turno,
} from "./mock-data";

export type EstadoCobro = "cobrado" | "parcial" | "pendiente";

type StoreValue = {
  clientes: Cliente[];
  servicios: Servicio[];
  turnos: Turno[];
  pagos: Pago[];
  atenciones: Atencion[];
  bloqueos: BloqueoHorario[];
  crearCliente: (datos: Omit<Cliente, "id">) => Cliente;
  editarCliente: (id: string, datos: Omit<Cliente, "id">) => void;
  crearServicio: (datos: Omit<Servicio, "id">) => void;
  editarServicio: (id: string, datos: Omit<Servicio, "id">) => void;
  alternarServicio: (id: string) => void;
  crearTurno: (datos: Omit<Turno, "id" | "estado">) => void;
  cambiarEstadoTurno: (id: string, estado: EstadoTurno, observaciones?: string) => void;
  registrarPago: (datos: Omit<Pago, "id">) => void;
  bloquearHorario: (datos: Omit<BloqueoHorario, "id">) => void;
  quitarBloqueo: (id: string) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

let secuencia = 100;
const nuevoId = (prefijo: string) => `${prefijo}${++secuencia}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [clientes, setClientes] = useState<Cliente[]>(CLIENTES);
  const [servicios, setServicios] = useState<Servicio[]>(SERVICIOS);
  const [turnos, setTurnos] = useState<Turno[]>(TURNOS);
  const [pagos, setPagos] = useState<Pago[]>(PAGOS);
  const [atenciones, setAtenciones] = useState<Atencion[]>(ATENCIONES);
  const [bloqueos, setBloqueos] = useState<BloqueoHorario[]>(BLOQUEOS_HORARIO);

  const crearCliente = useCallback((datos: Omit<Cliente, "id">) => {
    const cliente: Cliente = { id: nuevoId("c"), ...datos };
    setClientes((prev) => [...prev, cliente]);
    return cliente;
  }, []);

  const editarCliente = useCallback((id: string, datos: Omit<Cliente, "id">) => {
    setClientes((prev) => prev.map((c) => (c.id === id ? { id, ...datos } : c)));
  }, []);

  const crearServicio = useCallback((datos: Omit<Servicio, "id">) => {
    setServicios((prev) => [...prev, { id: nuevoId("s"), ...datos }]);
  }, []);

  const editarServicio = useCallback((id: string, datos: Omit<Servicio, "id">) => {
    setServicios((prev) => prev.map((s) => (s.id === id ? { id, ...datos } : s)));
  }, []);

  const alternarServicio = useCallback((id: string) => {
    setServicios((prev) => prev.map((s) => (s.id === id ? { ...s, activo: !s.activo } : s)));
  }, []);

  const crearTurno = useCallback((datos: Omit<Turno, "id" | "estado">) => {
    setTurnos((prev) => [...prev, { id: nuevoId("t"), estado: "reservado", ...datos }]);
  }, []);

  const cambiarEstadoTurno = useCallback(
    (id: string, estado: EstadoTurno, observaciones?: string) => {
      setTurnos((prev) => prev.map((t) => (t.id === id ? { ...t, estado } : t)));
      if (estado !== "realizado") return;
      const turno = turnos.find((t) => t.id === id);
      if (!turno) return;
      setAtenciones((prev) =>
        prev.some((a) => a.turnoId === id)
          ? prev
          : [
              ...prev,
              {
                id: nuevoId("a"),
                turnoId: id,
                fecha: turno.fecha,
                observaciones: observaciones?.trim() || "Sesión realizada sin observaciones.",
              },
            ],
      );
    },
    [turnos],
  );

  const registrarPago = useCallback((datos: Omit<Pago, "id">) => {
    setPagos((prev) => [...prev, { id: nuevoId("p"), ...datos }]);
  }, []);

  const bloquearHorario = useCallback((datos: Omit<BloqueoHorario, "id">) => {
    setBloqueos((prev) => [...prev, { id: nuevoId("b"), ...datos }]);
  }, []);

  const quitarBloqueo = useCallback((id: string) => {
    setBloqueos((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      clientes,
      servicios,
      turnos,
      pagos,
      atenciones,
      bloqueos,
      crearCliente,
      editarCliente,
      crearServicio,
      editarServicio,
      alternarServicio,
      crearTurno,
      cambiarEstadoTurno,
      registrarPago,
      bloquearHorario,
      quitarBloqueo,
    }),
    [
      clientes,
      servicios,
      turnos,
      pagos,
      atenciones,
      bloqueos,
      crearCliente,
      editarCliente,
      crearServicio,
      editarServicio,
      alternarServicio,
      crearTurno,
      cambiarEstadoTurno,
      registrarPago,
      bloquearHorario,
      quitarBloqueo,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore debe usarse dentro de StoreProvider");
  return ctx;
}

// ---------------------------------------------------------------------------
// Derivaciones
// ---------------------------------------------------------------------------

export const nombreCompleto = (c: Cliente) => `${c.nombre} ${c.apellido}`;

export const iniciales = (c: Cliente) => `${c.nombre[0] ?? ""}${c.apellido[0] ?? ""}`;

export const pagadoDeTurno = (pagos: Pago[], turnoId: string) =>
  pagos.filter((p) => p.turnoId === turnoId).reduce((a, p) => a + p.monto, 0);

export const estadoCobro = (precio: number, pagado: number): EstadoCobro => {
  if (pagado >= precio && precio > 0) return "cobrado";
  if (pagado > 0) return "parcial";
  return "pendiente";
};

export const franjasDeServicio = (duracion: number) => Math.max(1, Math.round(duracion / 30));

/** Índices de HORAS ocupados en un día por turnos activos y bloqueos. */
export function ocupacionDelDia(
  fecha: string,
  turnos: Turno[],
  servicios: Servicio[],
  bloqueos: BloqueoHorario[],
) {
  const ocupados = new Set<number>();

  turnos
    .filter((t) => t.fecha === fecha && t.estado !== "cancelado")
    .forEach((t) => {
      const servicio = servicios.find((s) => s.id === t.servicioId);
      const franjas = franjasDeServicio(servicio?.duracion ?? 60);
      const inicio = HORAS.indexOf(t.hora);
      for (let i = 0; i < franjas; i += 1) ocupados.add(inicio + i);
    });

  bloqueos
    .filter((b) => b.fecha === fecha)
    .forEach((b) => {
      let hora = b.horaInicio;
      while (hora < b.horaFin) {
        const idx = HORAS.indexOf(hora);
        if (idx >= 0) ocupados.add(idx);
        hora = sumarMinutos(hora, 30);
      }
    });

  return ocupados;
}

export type MedioPagoOpcion = MedioPago;
export type TipoPagoOpcion = TipoPago;

export const MEDIOS_PAGO: MedioPago[] = ["Efectivo", "Transferencia", "Débito", "Crédito"];
export const TIPOS_PAGO: TipoPago[] = ["Seña", "Pago"];

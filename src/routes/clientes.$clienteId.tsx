import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CalendarPlus, Mail, Pencil, Phone } from "lucide-react";
import { Badge, Detalle, StatCard, btnFantasma, btnPrimario } from "@/components/ui-kit";
import { ClienteFormModal } from "./clientes.index";
import {
  NuevoTurnoModal,
  PagoModal,
  TurnoDetalleModal,
  estadoTurnoLabel,
  estadoTurnoTono,
} from "@/components/turno-modals";
import { HOY, fechaLarga, formatoMoneda, nombreDia } from "@/lib/mock-data";
import { iniciales, nombreCompleto, pagadoDeTurno, useStore } from "@/lib/store";

export const Route = createFileRoute("/clientes/$clienteId")({
  head: () => ({
    meta: [
      { title: "Ficha de cliente — Roshan Masajes" },
      {
        name: "description",
        content:
          "Ficha del cliente en Roshan Masajes: datos de contacto, historial de turnos, atenciones y pagos.",
      },
      { property: "og:title", content: "Ficha de cliente — Roshan Masajes" },
      {
        property: "og:description",
        content: "Historial completo de sesiones, atenciones y pagos del cliente.",
      },
    ],
  }),
  component: FichaCliente,
});

type Modal =
  | { tipo: "editar" }
  | { tipo: "nuevoTurno" }
  | { tipo: "turno"; turnoId: string }
  | { tipo: "pago"; turnoId: string }
  | null;

function FichaCliente() {
  const { clienteId } = Route.useParams();
  const { clientes, turnos, servicios, pagos, atenciones, editarCliente } = useStore();
  const [modal, setModal] = useState<Modal>(null);

  const cliente = clientes.find((c) => c.id === clienteId);

  if (!cliente) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-3xl">Cliente no encontrado</h1>
        <Link to="/clientes" className={btnFantasma}>
          <ArrowLeft className="h-4 w-4" /> Volver a clientes
        </Link>
      </div>
    );
  }

  const historial = turnos
    .filter((t) => t.clienteId === cliente.id)
    .sort((a, b) => (a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : b.hora.localeCompare(a.hora)));

  const realizadas = historial.filter((t) => t.estado === "realizado").length;
  const totalPagado = historial.reduce((a, t) => a + pagadoDeTurno(pagos, t.id), 0);
  const saldo = historial
    .filter((t) => t.estado !== "cancelado")
    .reduce((total, t) => {
      const precio = servicios.find((s) => s.id === t.servicioId)?.precio ?? 0;
      return total + Math.max(0, precio - pagadoDeTurno(pagos, t.id));
    }, 0);
  const ultima = historial.find((t) => t.estado === "realizado");

  return (
    <div className="space-y-8">
      <Link
        to="/clientes"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Clientes
      </Link>

      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-6">
        <div className="flex items-center gap-5">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/40 font-display text-2xl text-primary">
            {iniciales(cliente)}
          </span>
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.4em] text-primary/70">Ficha</p>
            <h1 className="mt-1 font-display text-4xl">{nombreCompleto(cliente)}</h1>
            <p className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" /> {cliente.telefono}
              </span>
              <span className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" /> {cliente.email || "—"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-3">
          <button className={btnFantasma} onClick={() => setModal({ tipo: "editar" })}>
            <Pencil className="h-4 w-4" /> Editar datos
          </button>
          <button className={btnPrimario} onClick={() => setModal({ tipo: "nuevoTurno" })}>
            <CalendarPlus className="h-4 w-4" /> Agendar turno
          </button>
        </div>
      </header>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Sesiones realizadas" valor={String(realizadas)} />
        <StatCard label="Turnos totales" valor={String(historial.length)} />
        <StatCard label="Total abonado" valor={formatoMoneda(totalPagado)} />
        <StatCard label="Saldo pendiente" valor={formatoMoneda(saldo)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="panel-luxe space-y-3 rounded-xl p-6">
          <h2 className="font-display text-2xl">Datos personales</h2>
          <Detalle label="Nacimiento">
            {cliente.fechaNacimiento ? fechaLarga(cliente.fechaNacimiento) : "—"}
          </Detalle>
          <Detalle label="Última sesión">
            {ultima ? fechaLarga(ultima.fecha) : "Sin sesiones"}
          </Detalle>
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground">
              Observaciones
            </p>
            <p className="mt-2 text-sm text-foreground/90">{cliente.observaciones || "—"}</p>
          </div>
        </div>

        <div className="panel-luxe rounded-xl p-6 lg:col-span-2">
          <h2 className="font-display text-2xl">Historial de turnos</h2>
          <div className="mt-4 space-y-3">
            {historial.map((t) => {
              const servicio = servicios.find((s) => s.id === t.servicioId);
              const atencion = atenciones.find((a) => a.turnoId === t.id);
              const pagado = pagadoDeTurno(pagos, t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => setModal({ tipo: "turno", turnoId: t.id })}
                  className="block w-full rounded-md border border-border/60 px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-accent/40"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-foreground">{servicio?.nombre}</p>
                      <p className="text-xs text-muted-foreground">
                        {nombreDia(t.fecha)} {fechaLarga(t.fecha)} · {t.hora}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {formatoMoneda(pagado)} / {formatoMoneda(servicio?.precio ?? 0)}
                      </span>
                      <Badge tono={estadoTurnoTono[t.estado]}>{estadoTurnoLabel[t.estado]}</Badge>
                    </div>
                  </div>
                  {atencion ? (
                    <p className="mt-2 border-t border-border/40 pt-2 text-xs text-muted-foreground">
                      {atencion.observaciones}
                    </p>
                  ) : null}
                </button>
              );
            })}
            {!historial.length ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Todavía no tiene turnos registrados.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {modal?.tipo === "editar" ? (
        <ClienteFormModal
          cliente={cliente}
          onClose={() => setModal(null)}
          onGuardar={(datos) => {
            editarCliente(cliente.id, datos);
            setModal(null);
          }}
        />
      ) : null}

      {modal?.tipo === "nuevoTurno" ? (
        <NuevoTurnoModal
          fechaInicial={HOY}
          clienteInicial={cliente.id}
          onClose={() => setModal(null)}
        />
      ) : null}

      {modal?.tipo === "turno" ? (
        <TurnoDetalleModal
          turnoId={modal.turnoId}
          onClose={() => setModal(null)}
          onRegistrarPago={(turnoId) => setModal({ tipo: "pago", turnoId })}
        />
      ) : null}

      {modal?.tipo === "pago" ? (
        <PagoModal turnoId={modal.turnoId} onClose={() => setModal(null)} />
      ) : null}
    </div>
  );
}

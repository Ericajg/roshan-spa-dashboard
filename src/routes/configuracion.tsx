import { createFileRoute } from "@tanstack/react-router";
import { Clock, Lock, LogOut, ShieldCheck, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Detalle, btnNeutro, btnPeligro } from "@/components/ui-kit";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { HORAS, fechaLarga, nombreDia } from "@/lib/mock-data";

export const Route = createFileRoute("/configuracion")({
  head: () => ({
    meta: [
      { title: "Configuración del estudio — Roshan Masajes" },
      {
        name: "description",
        content:
          "Datos de la cuenta, horario de atención y bloqueos de agenda del estudio Roshan Masajes.",
      },
      { property: "og:title", content: "Configuración del estudio — Roshan Masajes" },
      {
        property: "og:description",
        content: "Cuenta, horario de atención y horarios bloqueados del estudio Roshan.",
      },
    ],
  }),
  component: Configuracion,
});

function Configuracion() {
  const { usuario, cerrarSesion } = useAuth();
  const { bloqueos, quitarBloqueo } = useStore();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Estudio Roshan"
        title="Configuración"
        description="Cuenta de acceso, horario de atención y horarios bloqueados de la agenda."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel-luxe space-y-3 rounded-xl p-6">
          <h2 className="flex items-center gap-2 font-display text-2xl">
            <ShieldCheck className="h-5 w-5 text-primary" /> Cuenta
          </h2>
          <Detalle label="Nombre">{usuario?.nombre ?? "—"}</Detalle>
          <Detalle label="Usuario">{usuario?.usuario ?? "—"}</Detalle>
          <Detalle label="Contraseña">••••••••</Detalle>
          <p className="text-xs text-muted-foreground">
            Único usuario del sistema. El cambio de contraseña se habilitará al conectar el
            servidor.
          </p>
          <button className={`${btnNeutro} mt-2`} onClick={cerrarSesion}>
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
        </section>

        <section className="panel-luxe space-y-3 rounded-xl p-6">
          <h2 className="flex items-center gap-2 font-display text-2xl">
            <Clock className="h-5 w-5 text-primary" /> Horario de atención
          </h2>
          <Detalle label="Días">Lunes a sábado</Detalle>
          <Detalle label="Desde">{HORAS[0]}</Detalle>
          <Detalle label="Hasta">{HORAS[HORAS.length - 1]}</Detalle>
          <Detalle label="Franjas">Cada 30 minutos</Detalle>
        </section>
      </div>

      <section className="panel-luxe rounded-xl p-6">
        <h2 className="flex items-center gap-2 font-display text-2xl">
          <Lock className="h-5 w-5 text-primary" /> Horarios bloqueados
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Franjas no disponibles para agendar. Se crean desde la Agenda tocando un horario libre.
        </p>

        <ul className="mt-5 space-y-3">
          {bloqueos.map((b) => (
            <li
              key={b.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border/60 px-4 py-3"
            >
              <div>
                <p className="text-sm text-foreground">{b.motivo}</p>
                <p className="text-xs text-muted-foreground">
                  {nombreDia(b.fecha)} {fechaLarga(b.fecha)} · {b.horaInicio} – {b.horaFin}
                </p>
              </div>
              <button className={btnPeligro} onClick={() => quitarBloqueo(b.id)}>
                <Trash2 className="h-3.5 w-3.5" /> Quitar
              </button>
            </li>
          ))}
          {!bloqueos.length ? (
            <li className="py-6 text-center text-sm text-muted-foreground">
              No hay horarios bloqueados.
            </li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}

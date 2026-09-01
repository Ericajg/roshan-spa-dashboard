import { createFileRoute } from "@tanstack/react-router";
import { Check, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DIAS, HORAS, TURNOS, type Turno } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Agenda semanal — Roshan Masajes" },
      {
        name: "description",
        content:
          "Vista semanal de turnos de Roshan Masajes, con horarios, servicios y estado de cada sesión.",
      },
      { property: "og:title", content: "Agenda semanal — Roshan Masajes" },
      {
        property: "og:description",
        content: "Vista semanal de turnos por día y horario del estudio Roshan.",
      },
    ],
  }),
  component: Agenda,
});

const estadoConfig: Record<
  Turno["estado"],
  { card: string; time: string; dot: string; label: string }
> = {
  confirmado: {
    card: "border border-primary/45 border-l-4 border-l-primary bg-primary/12 text-foreground",
    time: "text-primary/80",
    dot: "bg-primary",
    label: "Confirmado",
  },
  realizado: {
    card: "border border-status-success/45 border-l-4 border-l-status-success bg-status-success/12 text-foreground",
    time: "text-status-success",
    dot: "bg-status-success",
    label: "Realizado",
  },
  pendiente: {
    card: "border border-dashed border-status-warning/45 border-l-4 border-l-status-warning bg-status-warning/10 text-foreground/90",
    time: "text-status-warning",
    dot: "border border-status-warning bg-transparent",
    label: "Pendiente",
  },
  cancelado: {
    card: "border border-status-danger/40 border-l-4 border-l-status-danger bg-status-danger/10 text-muted-foreground",
    time: "text-status-danger/70",
    dot: "bg-status-danger",
    label: "Cancelado",
  },
};

const ROW = 44;

function Agenda() {
  const totalSemana = TURNOS.filter((t) => t.estado !== "cancelado").length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Semana del 1 al 6 de septiembre"
        title="Agenda"
        description={`${totalSemana} sesiones agendadas esta semana. Cada columna es un día del estudio.`}
        actions={
          <>
            <div className="flex items-center gap-1 rounded-md border border-border">
              <button className="px-3 py-2 text-muted-foreground transition-colors hover:text-primary">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Sep 2026
              </span>
              <button className="px-3 py-2 text-muted-foreground transition-colors hover:text-primary">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
              <Plus className="h-4 w-4" /> Nuevo turno
            </button>
          </>
        }
      />

      <div className="panel-luxe overflow-hidden rounded-xl">
        <div className="grid" style={{ gridTemplateColumns: `80px repeat(${DIAS.length}, 1fr)` }}>
          <div className="border-b border-r border-border px-3 py-4" />
          {DIAS.map((dia) => (
            <div
              key={dia.nombre}
              className="border-b border-r border-border px-4 py-4 text-center last:border-r-0"
            >
              <p className="font-display text-xl text-primary">{dia.nombre}</p>
              <p className="text-[0.7rem] uppercase tracking-[0.25em] text-muted-foreground">
                {dia.fecha}
              </p>
            </div>
          ))}

          <div className="border-r border-border">
            {HORAS.map((hora) => (
              <div
                key={hora}
                className="flex items-start justify-end border-b border-border/50 pr-3 pt-1 text-[0.7rem] text-muted-foreground"
                style={{ height: ROW }}
              >
                {hora.endsWith(":00") ? hora : ""}
              </div>
            ))}
          </div>

          {DIAS.map((dia, diaIdx) => (
            <div key={dia.nombre} className="relative border-r border-border last:border-r-0">
              {HORAS.map((hora) => (
                <div key={hora} className="border-b border-border/40" style={{ height: ROW }} />
              ))}
              {TURNOS.filter((t) => t.dia === diaIdx).map((turno) => {
                const top = HORAS.indexOf(turno.inicio) * ROW;
                return (
                  <article
                    key={turno.id}
                    className={`absolute left-1.5 right-1.5 overflow-hidden rounded-md px-3 py-2 text-left transition-transform hover:-translate-y-0.5 ${estadoConfig[turno.estado].card}`}
                    style={{ top: top + 3, height: turno.duracion * ROW - 6 }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className={`truncate text-xs font-medium tracking-wide ${turno.estado === "cancelado" ? "line-through" : ""}`}>
                        {turno.cliente}
                      </p>
                      {turno.estado === "realizado" ? (
                        <Check className="mt-0.5 h-3 w-3 shrink-0 text-status-success" />
                      ) : (
                        <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${estadoConfig[turno.estado].dot}`} />
                      )}
                    </div>
                    <p className={`truncate text-[0.7rem] text-muted-foreground ${turno.estado === "cancelado" ? "line-through" : ""}`}>
                      {turno.servicio}
                    </p>
                    <p className={`mt-1 text-[0.65rem] uppercase tracking-[0.2em] ${estadoConfig[turno.estado].time}`}>
                      {turno.inicio}
                    </p>
                  </article>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm border border-primary/45 border-l-2 border-l-primary bg-primary/15" />{" "}
          Confirmado
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm border border-dashed border-status-warning/45 border-l-2 border-l-status-warning bg-status-warning/15" />{" "}
          Pendiente
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm border border-status-success/45 border-l-2 border-l-status-success bg-status-success/15" />{" "}
          Realizado
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm border border-status-danger/40 border-l-2 border-l-status-danger bg-status-danger/15" />{" "}
          Cancelado
        </span>
      </div>
    </div>
  );
}

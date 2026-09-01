import { createFileRoute } from "@tanstack/react-router";
import { Clock, Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SERVICIOS, formatoMoneda } from "@/lib/mock-data";

export const Route = createFileRoute("/servicios")({
  head: () => ({
    meta: [
      { title: "Servicios — Roshan Masajes" },
      {
        name: "description",
        content:
          "Catálogo de masajes y rituales de Roshan: duración, precio y disponibilidad de cada servicio.",
      },
      { property: "og:title", content: "Servicios — Roshan Masajes" },
      {
        property: "og:description",
        content: "Catálogo de masajes y rituales con duración y precio.",
      },
    ],
  }),
  component: Servicios,
});

function Servicios() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Carta del estudio"
        title="Servicios"
        description="Cada tratamiento con su duración, valor y estado de publicación."
        actions={
          <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
            <Plus className="h-4 w-4" /> Nuevo servicio
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-5">
        {SERVICIOS.map((s) => (
          <article
            key={s.id}
            className="panel-luxe flex flex-col rounded-xl p-6 transition-transform hover:-translate-y-1"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-[0.62rem] uppercase tracking-[0.3em] text-primary/70">
                {s.categoria}
              </p>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[0.6rem] uppercase tracking-[0.2em] ${
                  s.activo ? "border-primary/40 text-primary" : "border-border text-muted-foreground"
                }`}
              >
                {s.activo ? "Activo" : "Pausado"}
              </span>
            </div>
            <h2 className="mt-3 text-2xl">{s.nombre}</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.descripcion}</p>
            <div className="mt-5 h-px hairline-gold" />
            <div className="mt-4 flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> {s.duracion} min
              </span>
              <span className="font-display text-2xl text-primary">{formatoMoneda(s.precio)}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

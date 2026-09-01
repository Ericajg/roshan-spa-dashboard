import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { CLIENTES, type Cliente } from "@/lib/mock-data";

export const Route = createFileRoute("/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes — Roshan Masajes" },
      {
        name: "description",
        content:
          "Ficha de clientes de Roshan Masajes: contacto, sesiones acumuladas y preferencias de cada persona.",
      },
      { property: "og:title", content: "Clientes — Roshan Masajes" },
      {
        property: "og:description",
        content: "Listado de clientes con contacto, historial y preferencias.",
      },
    ],
  }),
  component: Clientes,
});

const estadoClase: Record<Cliente["estado"], string> = {
  activo: "border-primary/40 text-primary",
  nuevo: "border-chart-2/50 text-chart-2",
  inactivo: "border-border text-muted-foreground",
};

function Clientes() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Base de clientes"
        title="Clientes"
        description={`${CLIENTES.length} personas registradas en el estudio.`}
        actions={
          <>
            <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              <input
                placeholder="Buscar cliente"
                className="w-40 bg-transparent outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
              <Plus className="h-4 w-4" /> Nuevo cliente
            </button>
          </>
        }
      />

      <div className="panel-luxe overflow-hidden rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
              <th className="px-6 py-4 font-normal">Cliente</th>
              <th className="px-6 py-4 font-normal">Contacto</th>
              <th className="px-6 py-4 font-normal">Sesiones</th>
              <th className="px-6 py-4 font-normal">Última visita</th>
              <th className="px-6 py-4 font-normal">Preferencias</th>
              <th className="px-6 py-4 font-normal">Estado</th>
            </tr>
          </thead>
          <tbody>
            {CLIENTES.map((c) => (
              <tr
                key={c.id}
                className="border-b border-border/50 transition-colors last:border-b-0 hover:bg-secondary/40"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 font-display text-sm text-primary">
                      {c.nombre
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    <span className="font-medium">{c.nombre}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  <p>{c.telefono}</p>
                  <p className="text-xs">{c.email}</p>
                </td>
                <td className="px-6 py-4 font-display text-lg text-primary">{c.sesiones}</td>
                <td className="px-6 py-4 text-muted-foreground">{c.ultimaVisita}</td>
                <td className="px-6 py-4 text-muted-foreground">{c.preferencia}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full border px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] ${estadoClase[c.estado]}`}
                  >
                    {c.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

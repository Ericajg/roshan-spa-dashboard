import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { PAGOS, formatoMoneda, type Pago } from "@/lib/mock-data";

export const Route = createFileRoute("/pagos")({
  head: () => ({
    meta: [
      { title: "Pagos — Roshan Masajes" },
      {
        name: "description",
        content:
          "Cobros de la semana en Roshan Masajes: montos, medios de pago y estado de cada sesión.",
      },
      { property: "og:title", content: "Pagos — Roshan Masajes" },
      {
        property: "og:description",
        content: "Registro de cobros semanales por cliente, servicio y medio de pago.",
      },
    ],
  }),
  component: Pagos,
});

const estadoClase: Record<Pago["estado"], string> = {
  cobrado: "border-primary/40 text-primary",
  pendiente: "border-chart-4/50 text-chart-4",
  reembolsado: "border-destructive/40 text-destructive",
};

function Pagos() {
  const cobrado = PAGOS.filter((p) => p.estado === "cobrado").reduce((a, p) => a + p.monto, 0);
  const pendiente = PAGOS.filter((p) => p.estado === "pendiente").reduce((a, p) => a + p.monto, 0);
  const ticket = Math.round(PAGOS.reduce((a, p) => a + p.monto, 0) / PAGOS.length);

  const metricas = [
    { label: "Cobrado en la semana", valor: formatoMoneda(cobrado) },
    { label: "Pendiente de cobro", valor: formatoMoneda(pendiente) },
    { label: "Ticket promedio", valor: formatoMoneda(ticket) },
    { label: "Sesiones facturadas", valor: String(PAGOS.length) },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Semana del 1 al 6 de septiembre"
        title="Pagos"
        description="Seguimiento de cobros por sesión y medio de pago."
        actions={
          <button className="inline-flex items-center gap-2 rounded-md border border-primary/50 px-4 py-2 text-sm text-primary transition-colors hover:bg-primary/10">
            <Download className="h-4 w-4" /> Exportar
          </button>
        }
      />

      <div className="grid grid-cols-4 gap-5">
        {metricas.map((m) => (
          <div key={m.label} className="panel-luxe rounded-xl p-6">
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground">
              {m.label}
            </p>
            <p className="mt-3 font-display text-3xl text-primary">{m.valor}</p>
          </div>
        ))}
      </div>

      <div className="panel-luxe overflow-hidden rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
              <th className="px-6 py-4 font-normal">Fecha</th>
              <th className="px-6 py-4 font-normal">Cliente</th>
              <th className="px-6 py-4 font-normal">Servicio</th>
              <th className="px-6 py-4 font-normal">Medio</th>
              <th className="px-6 py-4 font-normal">Estado</th>
              <th className="px-6 py-4 text-right font-normal">Monto</th>
            </tr>
          </thead>
          <tbody>
            {PAGOS.map((p) => (
              <tr
                key={p.id}
                className="border-b border-border/50 transition-colors last:border-b-0 hover:bg-secondary/40"
              >
                <td className="px-6 py-4 text-muted-foreground">{p.fecha}</td>
                <td className="px-6 py-4 font-medium">{p.cliente}</td>
                <td className="px-6 py-4 text-muted-foreground">{p.servicio}</td>
                <td className="px-6 py-4 text-muted-foreground">{p.metodo}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full border px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] ${estadoClase[p.estado]}`}
                  >
                    {p.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-display text-lg text-primary">
                  {formatoMoneda(p.monto)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

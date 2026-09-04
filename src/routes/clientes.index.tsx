import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronRight, Pencil, Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Modal } from "@/components/Modal";
import {
  Badge,
  Campo,
  Input,
  Textarea,
  btnNeutro,
  btnPrimario,
  StatCard,
} from "@/components/ui-kit";
import { fechaLarga, type Cliente } from "@/lib/mock-data";
import { nombreCompleto, iniciales, useStore } from "@/lib/store";

export const Route = createFileRoute("/clientes/")({
  head: () => ({
    meta: [
      { title: "Clientes — Roshan Masajes" },
      {
        name: "description",
        content:
          "Listado de clientes de Roshan Masajes con teléfono, historial de sesiones y preferencias.",
      },
      { property: "og:title", content: "Clientes — Roshan Masajes" },
      {
        property: "og:description",
        content: "Base de clientes del estudio Roshan: contacto, historial y observaciones.",
      },
    ],
  }),
  component: Clientes,
});

const vacio = {
  nombre: "",
  apellido: "",
  telefono: "",
  email: "",
  fechaNacimiento: "",
  observaciones: "",
};

function Clientes() {
  const { clientes, turnos, crearCliente, editarCliente } = useStore();
  const [busqueda, setBusqueda] = useState("");
  const [editando, setEditando] = useState<Cliente | "nuevo" | null>(null);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return clientes;
    return clientes.filter((c) =>
      `${c.nombre} ${c.apellido} ${c.telefono} ${c.email}`.toLowerCase().includes(q),
    );
  }, [clientes, busqueda]);

  const sesionesDe = (id: string) =>
    turnos.filter((t) => t.clienteId === id && t.estado === "realizado").length;

  const nuevosDelMes = clientes.filter((c) => !turnos.some((t) => t.clienteId === c.id)).length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Base del estudio"
        title="Clientes"
        description="Contacto, historial de sesiones y preferencias de cada persona."
        actions={
          <button className={btnPrimario} onClick={() => setEditando("nuevo")}>
            <Plus className="h-4 w-4" /> Nuevo cliente
          </button>
        }
      />

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard label="Clientes registrados" valor={String(clientes.length)} />
        <StatCard
          label="Sesiones realizadas"
          valor={String(turnos.filter((t) => t.estado === "realizado").length)}
        />
        <StatCard label="Sin sesiones aún" valor={String(nuevosDelMes)} detalle="Primer contacto" />
      </div>

      <label className="relative block max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, teléfono o email"
          className="pl-9"
        />
      </label>

      <div className="panel-luxe overflow-hidden rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[0.62rem] uppercase tracking-[0.24em] text-muted-foreground">
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Contacto</th>
              <th className="px-6 py-4">Nacimiento</th>
              <th className="px-6 py-4 text-center">Sesiones</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {filtrados.map((c) => (
              <tr key={c.id} className="border-b border-border/40 last:border-b-0 hover:bg-accent/40">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/40 font-display text-sm text-primary">
                      {iniciales(c)}
                    </span>
                    <div>
                      <p className="text-foreground">{nombreCompleto(c)}</p>
                      <p className="max-w-xs truncate text-xs text-muted-foreground">
                        {c.observaciones}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  <p className="text-foreground/90">{c.telefono}</p>
                  <p className="text-xs">{c.email}</p>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {c.fechaNacimiento ? fechaLarga(c.fechaNacimiento) : "—"}
                </td>
                <td className="px-6 py-4 text-center">
                  <Badge tono={sesionesDe(c.id) > 0 ? "oro" : "neutro"}>{sesionesDe(c.id)}</Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      aria-label={`Editar ${nombreCompleto(c)}`}
                      onClick={() => setEditando(c)}
                      className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:text-primary"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <Link
                      to="/clientes/$clienteId"
                      params={{ clienteId: c.id }}
                      className="inline-flex items-center gap-1 rounded-md border border-primary/45 px-3 py-2 text-xs uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/10"
                    >
                      Ficha <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {!filtrados.length ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                  No se encontraron clientes con ese criterio.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {editando ? (
        <ClienteFormModal
          cliente={editando === "nuevo" ? null : editando}
          onClose={() => setEditando(null)}
          onGuardar={(datos) => {
            if (editando === "nuevo") crearCliente(datos);
            else editarCliente(editando.id, datos);
            setEditando(null);
          }}
        />
      ) : null}
    </div>
  );
}

export function ClienteFormModal({
  cliente,
  onClose,
  onGuardar,
}: {
  cliente: Cliente | null;
  onClose: () => void;
  onGuardar: (datos: Omit<Cliente, "id">) => void;
}) {
  const [form, setForm] = useState<Omit<Cliente, "id">>(
    cliente
      ? {
          nombre: cliente.nombre,
          apellido: cliente.apellido,
          telefono: cliente.telefono,
          email: cliente.email,
          fechaNacimiento: cliente.fechaNacimiento,
          observaciones: cliente.observaciones,
        }
      : vacio,
  );

  const set = (campo: keyof typeof form) => (valor: string) =>
    setForm((f) => ({ ...f, [campo]: valor }));

  const puede = form.nombre.trim() && form.apellido.trim() && form.telefono.trim();

  return (
    <Modal
      abierto
      eyebrow="Clientes"
      titulo={cliente ? "Editar cliente" : "Nuevo cliente"}
      onClose={onClose}
      footer={
        <>
          <button className={btnNeutro} onClick={onClose}>
            Cancelar
          </button>
          <button className={btnPrimario} disabled={!puede} onClick={() => onGuardar(form)}>
            Guardar cliente
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <Campo label="Nombre">
          <Input value={form.nombre} onChange={(e) => set("nombre")(e.target.value)} />
        </Campo>
        <Campo label="Apellido">
          <Input value={form.apellido} onChange={(e) => set("apellido")(e.target.value)} />
        </Campo>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Campo label="Teléfono">
          <Input value={form.telefono} onChange={(e) => set("telefono")(e.target.value)} />
        </Campo>
        <Campo label="Fecha de nacimiento">
          <Input
            type="date"
            value={form.fechaNacimiento}
            onChange={(e) => set("fechaNacimiento")(e.target.value)}
          />
        </Campo>
      </div>

      <Campo label="Email">
        <Input
          type="email"
          value={form.email}
          onChange={(e) => set("email")(e.target.value)}
        />
      </Campo>

      <Campo label="Observaciones" hint="Preferencias, alergias, presión, aromas.">
        <Textarea
          rows={3}
          value={form.observaciones}
          onChange={(e) => set("observaciones")(e.target.value)}
        />
      </Campo>
    </Modal>
  );
}

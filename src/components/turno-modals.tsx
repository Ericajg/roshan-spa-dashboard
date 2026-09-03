import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Ban, CalendarPlus, Check, Lock, UserRound, Wallet } from "lucide-react";
import { Modal } from "@/components/Modal";
import {
  Badge,
  Campo,
  Detalle,
  Input,
  Select,
  Textarea,
  btnExito,
  btnFantasma,
  btnNeutro,
  btnPeligro,
  btnPrimario,
  type Tono,
} from "@/components/ui-kit";
import {
  HORAS,
  fechaLarga,
  formatoMoneda,
  nombreDia,
  sumarMinutos,
  type EstadoTurno,
} from "@/lib/mock-data";
import {
  MEDIOS_PAGO,
  TIPOS_PAGO,
  estadoCobro,
  franjasDeServicio,
  nombreCompleto,
  ocupacionDelDia,
  pagadoDeTurno,
  useStore,
} from "@/lib/store";

export const estadoTurnoTono: Record<EstadoTurno, Tono> = {
  reservado: "oro",
  realizado: "verde",
  cancelado: "rojo",
  ausente: "ambar",
};

export const estadoTurnoLabel: Record<EstadoTurno, string> = {
  reservado: "Reservado",
  realizado: "Realizado",
  cancelado: "Cancelado",
  ausente: "Ausente",
};

const cobroTono = { cobrado: "verde", parcial: "ambar", pendiente: "rojo" } as const;
const cobroLabel = { cobrado: "Cobrado", parcial: "Parcial", pendiente: "Sin cobrar" } as const;

// ---------------------------------------------------------------------------
// Detalle de turno
// ---------------------------------------------------------------------------

export function TurnoDetalleModal({
  turnoId,
  onClose,
  onRegistrarPago,
}: {
  turnoId: string;
  onClose: () => void;
  onRegistrarPago: (turnoId: string) => void;
}) {
  const { turnos, clientes, servicios, pagos, atenciones, cambiarEstadoTurno } = useStore();
  const navigate = useNavigate();
  const [confirmando, setConfirmando] = useState<null | "realizado" | "cancelado" | "ausente">(null);
  const [observaciones, setObservaciones] = useState("");

  const turno = turnos.find((t) => t.id === turnoId);
  if (!turno) return null;

  const cliente = clientes.find((c) => c.id === turno.clienteId);
  const servicio = servicios.find((s) => s.id === turno.servicioId);
  const precio = servicio?.precio ?? 0;
  const pagado = pagadoDeTurno(pagos, turno.id);
  const cobro = estadoCobro(precio, pagado);
  const atencion = atenciones.find((a) => a.turnoId === turno.id);
  const pagosTurno = pagos.filter((p) => p.turnoId === turno.id);
  const activo = turno.estado === "reservado";

  const aplicar = (estado: EstadoTurno) => {
    cambiarEstadoTurno(turno.id, estado, observaciones);
    setConfirmando(null);
    onClose();
  };

  return (
    <Modal
      abierto
      eyebrow={`${nombreDia(turno.fecha)} · ${fechaLarga(turno.fecha)}`}
      titulo={cliente ? nombreCompleto(cliente) : "Turno"}
      onClose={onClose}
      footer={
        confirmando ? null : (
          <>
            {cliente ? (
              <button
                className={btnNeutro}
                onClick={() => {
                  onClose();
                  navigate({ to: "/clientes/$clienteId", params: { clienteId: cliente.id } });
                }}
              >
                <UserRound className="h-4 w-4" /> Ver ficha
              </button>
            ) : null}
            {turno.estado !== "cancelado" && cobro !== "cobrado" ? (
              <button
                className={btnFantasma}
                onClick={() => {
                  onClose();
                  onRegistrarPago(turno.id);
                }}
              >
                <Wallet className="h-4 w-4" /> Registrar pago
              </button>
            ) : null}
            {activo ? (
              <>
                <button className={btnPeligro} onClick={() => setConfirmando("cancelado")}>
                  <Ban className="h-4 w-4" /> Cancelar turno
                </button>
                <button className={btnNeutro} onClick={() => setConfirmando("ausente")}>
                  Marcar ausente
                </button>
                <button className={btnExito} onClick={() => setConfirmando("realizado")}>
                  <Check className="h-4 w-4" /> Marcar realizado
                </button>
              </>
            ) : null}
          </>
        )
      }
    >
      {confirmando ? (
        <ConfirmacionEstado
          estado={confirmando}
          observaciones={observaciones}
          setObservaciones={setObservaciones}
          onCancelar={() => setConfirmando(null)}
          onConfirmar={() => aplicar(confirmando)}
        />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <Badge tono={estadoTurnoTono[turno.estado]}>{estadoTurnoLabel[turno.estado]}</Badge>
            <Badge tono={cobroTono[cobro]}>{cobroLabel[cobro]}</Badge>
          </div>

          <div className="space-y-2">
            <Detalle label="Servicio">{servicio?.nombre ?? "—"}</Detalle>
            <Detalle label="Horario">
              {turno.hora} – {sumarMinutos(turno.hora, servicio?.duracion ?? 60)}
            </Detalle>
            <Detalle label="Duración">{servicio?.duracion ?? 60} min</Detalle>
            <Detalle label="Teléfono">{cliente?.telefono ?? "—"}</Detalle>
            <Detalle label="Precio">{formatoMoneda(precio)}</Detalle>
            <Detalle label="Pagado">{formatoMoneda(pagado)}</Detalle>
            <Detalle label="Saldo">
              <span className={precio - pagado > 0 ? "text-status-warning" : "text-status-success"}>
                {formatoMoneda(Math.max(0, precio - pagado))}
              </span>
            </Detalle>
          </div>

          {pagosTurno.length ? (
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground">
                Pagos del turno
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                {pagosTurno.map((p) => (
                  <li key={p.id} className="flex justify-between gap-4 text-muted-foreground">
                    <span>
                      {p.tipo} · {p.medio}
                    </span>
                    <span className="text-foreground">{formatoMoneda(p.monto)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {cliente?.observaciones ? (
            <div className="rounded-md border border-border/60 px-4 py-3">
              <p className="text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground">
                Preferencias del cliente
              </p>
              <p className="mt-1 text-sm text-foreground/90">{cliente.observaciones}</p>
            </div>
          ) : null}

          {atencion ? (
            <div className="rounded-md border border-status-success/40 bg-status-success/5 px-4 py-3">
              <p className="text-[0.62rem] uppercase tracking-[0.28em] text-status-success">
                Atención registrada
              </p>
              <p className="mt-1 text-sm text-foreground/90">{atencion.observaciones}</p>
            </div>
          ) : null}
        </>
      )}
    </Modal>
  );
}

function ConfirmacionEstado({
  estado,
  observaciones,
  setObservaciones,
  onCancelar,
  onConfirmar,
}: {
  estado: "realizado" | "cancelado" | "ausente";
  observaciones: string;
  setObservaciones: (v: string) => void;
  onCancelar: () => void;
  onConfirmar: () => void;
}) {
  const textos = {
    realizado: {
      titulo: "¿Confirmás que la sesión fue realizada?",
      detalle: "Se registrará la atención con la fecha del turno.",
      boton: "Sí, fue realizada",
      clase: btnExito,
    },
    cancelado: {
      titulo: "¿Cancelar este turno?",
      detalle: "El horario vuelve a quedar disponible en la agenda.",
      boton: "Sí, cancelar turno",
      clase: btnPeligro,
    },
    ausente: {
      titulo: "¿Marcar al cliente como ausente?",
      detalle: "Queda registrado que no se presentó a la sesión.",
      boton: "Sí, no se presentó",
      clase: btnNeutro,
    },
  }[estado];

  return (
    <div className="space-y-4">
      <p className="font-display text-xl">{textos.titulo}</p>
      <p className="text-sm text-muted-foreground">{textos.detalle}</p>

      {estado === "realizado" ? (
        <Campo label="Observaciones de la atención">
          <Textarea
            rows={3}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Zonas trabajadas, sugerencias, próxima sesión…"
          />
        </Campo>
      ) : null}

      <div className="flex justify-end gap-3">
        <button className={btnNeutro} onClick={onCancelar}>
          Volver
        </button>
        <button className={textos.clase} onClick={onConfirmar}>
          {textos.boton}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Nuevo turno
// ---------------------------------------------------------------------------

export function NuevoTurnoModal({
  fechaInicial,
  horaInicial,
  clienteInicial,
  onClose,
}: {
  fechaInicial: string;
  horaInicial?: string;
  clienteInicial?: string;
  onClose: () => void;
}) {
  const { clientes, servicios, turnos, bloqueos, crearTurno } = useStore();
  const activos = servicios.filter((s) => s.activo);

  const [clienteId, setClienteId] = useState(clienteInicial ?? clientes[0]?.id ?? "");
  const [servicioId, setServicioId] = useState(activos[0]?.id ?? "");
  const [fecha, setFecha] = useState(fechaInicial);
  const [hora, setHora] = useState(horaInicial ?? HORAS[0]);
  const [confirmar, setConfirmar] = useState(false);

  const servicio = activos.find((s) => s.id === servicioId);
  const cliente = clientes.find((c) => c.id === clienteId);
  const franjas = franjasDeServicio(servicio?.duracion ?? 60);

  const ocupados = useMemo(
    () => ocupacionDelDia(fecha, turnos, servicios, bloqueos),
    [fecha, turnos, servicios, bloqueos],
  );

  const inicio = HORAS.indexOf(hora);
  const cabe = inicio >= 0 && inicio + franjas <= HORAS.length;
  const libre =
    cabe && Array.from({ length: franjas }, (_, i) => inicio + i).every((i) => !ocupados.has(i));
  const puede = Boolean(clienteId && servicioId && libre);

  const guardar = () => {
    crearTurno({ clienteId, servicioId, fecha, hora });
    onClose();
  };

  return (
    <Modal
      abierto
      eyebrow="Agenda"
      titulo={confirmar ? "Confirmar turno" : "Nuevo turno"}
      onClose={onClose}
      footer={
        confirmar ? (
          <>
            <button className={btnNeutro} onClick={() => setConfirmar(false)}>
              Volver
            </button>
            <button className={btnPrimario} onClick={guardar}>
              <Check className="h-4 w-4" /> Confirmar turno
            </button>
          </>
        ) : (
          <>
            <button className={btnNeutro} onClick={onClose}>
              Cancelar
            </button>
            <button className={btnPrimario} disabled={!puede} onClick={() => setConfirmar(true)}>
              <CalendarPlus className="h-4 w-4" /> Continuar
            </button>
          </>
        )
      }
    >
      {confirmar ? (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Revisá los datos antes de agendar la sesión.
          </p>
          <Detalle label="Cliente">{cliente ? nombreCompleto(cliente) : "—"}</Detalle>
          <Detalle label="Servicio">{servicio?.nombre ?? "—"}</Detalle>
          <Detalle label="Fecha">{`${nombreDia(fecha)} · ${fechaLarga(fecha)}`}</Detalle>
          <Detalle label="Horario">
            {hora} – {sumarMinutos(hora, servicio?.duracion ?? 60)}
          </Detalle>
          <Detalle label="Precio">{formatoMoneda(servicio?.precio ?? 0)}</Detalle>
        </div>
      ) : (
        <>
          <Campo label="Cliente">
            <Select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {nombreCompleto(c)}
                </option>
              ))}
            </Select>
          </Campo>

          <Campo label="Servicio" hint="Solo se listan los servicios activos.">
            <Select value={servicioId} onChange={(e) => setServicioId(e.target.value)}>
              {activos.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre} · {s.duracion} min · {formatoMoneda(s.precio)}
                </option>
              ))}
            </Select>
          </Campo>

          <div className="grid grid-cols-2 gap-4">
            <Campo label="Fecha">
              <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </Campo>
            <Campo label="Hora de inicio">
              <Select value={hora} onChange={(e) => setHora(e.target.value)}>
                {HORAS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </Select>
            </Campo>
          </div>

          {!libre ? (
            <p className="rounded-md border border-status-danger/50 bg-status-danger/10 px-3 py-2 text-xs text-status-danger">
              {cabe
                ? "Ese horario ya está ocupado o bloqueado. Elegí otro."
                : "La sesión no entra dentro del horario de atención."}
            </p>
          ) : (
            <p className="text-xs text-status-success">
              Horario disponible ({hora} – {sumarMinutos(hora, servicio?.duracion ?? 60)}).
            </p>
          )}
        </>
      )}
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Registrar pago
// ---------------------------------------------------------------------------

export function PagoModal({ turnoId, onClose }: { turnoId: string; onClose: () => void }) {
  const { turnos, clientes, servicios, pagos, registrarPago } = useStore();
  const turno = turnos.find((t) => t.id === turnoId);
  const servicio = servicios.find((s) => s.id === turno?.servicioId);
  const cliente = clientes.find((c) => c.id === turno?.clienteId);
  const precio = servicio?.precio ?? 0;
  const pagado = turno ? pagadoDeTurno(pagos, turno.id) : 0;
  const saldo = Math.max(0, precio - pagado);

  const [tipo, setTipo] = useState<(typeof TIPOS_PAGO)[number]>(pagado > 0 ? "Pago" : "Seña");
  const [medio, setMedio] = useState<(typeof MEDIOS_PAGO)[number]>("Efectivo");
  const [monto, setMonto] = useState(String(saldo));

  if (!turno) return null;

  const valor = Number(monto) || 0;

  const guardar = () => {
    registrarPago({ turnoId: turno.id, fecha: turno.fecha, tipo, medio, monto: valor });
    onClose();
  };

  return (
    <Modal
      abierto
      eyebrow="Pagos"
      titulo="Registrar pago"
      onClose={onClose}
      footer={
        <>
          <button className={btnNeutro} onClick={onClose}>
            Cancelar
          </button>
          <button className={btnPrimario} disabled={valor <= 0} onClick={guardar}>
            <Wallet className="h-4 w-4" /> Registrar
          </button>
        </>
      }
    >
      <div className="space-y-2">
        <Detalle label="Cliente">{cliente ? nombreCompleto(cliente) : "—"}</Detalle>
        <Detalle label="Servicio">{servicio?.nombre ?? "—"}</Detalle>
        <Detalle label="Precio">{formatoMoneda(precio)}</Detalle>
        <Detalle label="Saldo pendiente">{formatoMoneda(saldo)}</Detalle>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Campo label="Tipo">
          <Select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as (typeof TIPOS_PAGO)[number])}
          >
            {TIPOS_PAGO.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Campo>
        <Campo label="Medio de pago">
          <Select
            value={medio}
            onChange={(e) => setMedio(e.target.value as (typeof MEDIOS_PAGO)[number])}
          >
            {MEDIOS_PAGO.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
        </Campo>
      </div>

      <Campo label="Monto">
        <Input
          type="number"
          min={0}
          step={500}
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
        />
      </Campo>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Horario libre → crear turno o bloquear
// ---------------------------------------------------------------------------

export function SlotLibreModal({
  fecha,
  hora,
  onCrearTurno,
  onBloquear,
  onClose,
}: {
  fecha: string;
  hora: string;
  onCrearTurno: () => void;
  onBloquear: () => void;
  onClose: () => void;
}) {
  return (
    <Modal
      abierto
      ancho="max-w-md"
      eyebrow={`${nombreDia(fecha)} · ${fechaLarga(fecha)}`}
      titulo={`Horario libre ${hora}`}
      onClose={onClose}
    >
      <p className="text-sm text-muted-foreground">¿Qué querés hacer con esta franja?</p>
      <div className="grid gap-3">
        <button className={btnPrimario} onClick={onCrearTurno}>
          <CalendarPlus className="h-4 w-4" /> Agendar un turno
        </button>
        <button className={btnNeutro} onClick={onBloquear}>
          <Lock className="h-4 w-4" /> Bloquear el horario
        </button>
      </div>
    </Modal>
  );
}

export function BloqueoModal({
  fecha,
  hora,
  onClose,
}: {
  fecha: string;
  hora: string;
  onClose: () => void;
}) {
  const { bloquearHorario } = useStore();
  const [motivo, setMotivo] = useState("");
  const [minutos, setMinutos] = useState(60);

  const guardar = () => {
    bloquearHorario({
      fecha,
      horaInicio: hora,
      horaFin: sumarMinutos(hora, minutos),
      motivo: motivo.trim() || "Sin disponibilidad",
    });
    onClose();
  };

  return (
    <Modal
      abierto
      ancho="max-w-md"
      eyebrow={`${nombreDia(fecha)} · ${fechaLarga(fecha)}`}
      titulo="Bloquear horario"
      onClose={onClose}
      footer={
        <>
          <button className={btnNeutro} onClick={onClose}>
            Cancelar
          </button>
          <button className={btnPrimario} onClick={guardar}>
            <Lock className="h-4 w-4" /> Bloquear
          </button>
        </>
      }
    >
      <Detalle label="Desde">{hora}</Detalle>
      <Campo label="Duración">
        <Select value={minutos} onChange={(e) => setMinutos(Number(e.target.value))}>
          <option value={30}>30 minutos</option>
          <option value={60}>1 hora</option>
          <option value={90}>1 hora 30</option>
          <option value={120}>2 horas</option>
        </Select>
      </Campo>
      <Campo label="Motivo">
        <Input
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Almuerzo, trámite, descanso…"
        />
      </Campo>
    </Modal>
  );
}

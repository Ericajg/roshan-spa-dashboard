// ============================================================================
// Datos ficticios de ROSHAN MASAJES.
// Las entidades respetan exactamente el modelo que luego vivirá en SQL Server:
// Usuario, Cliente, Servicio, Turno, Pago, Atencion, Bloqueo_Horario.
// ============================================================================

export type Usuario = {
  id: string;
  usuario: string;
  password: string;
  nombre: string;
};

export type Cliente = {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  fechaNacimiento: string; // YYYY-MM-DD
  observaciones: string;
};

export type Servicio = {
  id: string;
  nombre: string;
  precio: number;
  duracion: number; // minutos
  descripcion: string;
  categoria: string;
  activo: boolean;
};

export type EstadoTurno = "reservado" | "realizado" | "cancelado" | "ausente";

export type Turno = {
  id: string;
  clienteId: string;
  servicioId: string;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:MM
  estado: EstadoTurno;
};

export type TipoPago = "Seña" | "Pago";
export type MedioPago = "Efectivo" | "Transferencia" | "Débito" | "Crédito";

export type Pago = {
  id: string;
  turnoId: string;
  fecha: string; // YYYY-MM-DD
  tipo: TipoPago;
  medio: MedioPago;
  monto: number;
};

export type Atencion = {
  id: string;
  turnoId: string;
  fecha: string; // YYYY-MM-DD
  observaciones: string;
};

export type BloqueoHorario = {
  id: string;
  fecha: string; // YYYY-MM-DD
  horaInicio: string;
  horaFin: string;
  motivo: string;
};

// ---------------------------------------------------------------------------
// Fechas y horarios de atención
// ---------------------------------------------------------------------------

export const HOY = "2026-09-02";

export const HORAS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
];

const MESES = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

const DIAS_SEMANA = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const toDate = (iso: string) => new Date(`${iso}T12:00:00Z`);

const toIso = (d: Date) => d.toISOString().slice(0, 10);

export const sumarDias = (iso: string, dias: number) => {
  const d = toDate(iso);
  d.setUTCDate(d.getUTCDate() + dias);
  return toIso(d);
};

/** Lunes de la semana que contiene `iso`. */
export const inicioSemana = (iso: string) => {
  const d = toDate(iso);
  const dow = d.getUTCDay();
  return sumarDias(iso, dow === 0 ? -6 : 1 - dow);
};

/** Lunes a sábado de la semana de `iso`. */
export const semanaDe = (iso: string) => {
  const lunes = inicioSemana(iso);
  return Array.from({ length: 6 }, (_, i) => sumarDias(lunes, i));
};

export const nombreDia = (iso: string) => DIAS_SEMANA[toDate(iso).getUTCDay()];

export const fechaCorta = (iso: string) => {
  const d = toDate(iso);
  return `${d.getUTCDate()} ${MESES[d.getUTCMonth()]}`;
};

export const fechaLarga = (iso: string) => {
  const d = toDate(iso);
  return `${d.getUTCDate()} ${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

export const sumarMinutos = (hora: string, minutos: number) => {
  const [h = 0, m = 0] = hora.split(":").map(Number);
  const total = h * 60 + m + minutos;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

export const formatoMoneda = (valor: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);

// ---------------------------------------------------------------------------
// Usuario
// ---------------------------------------------------------------------------

export const USUARIOS: Usuario[] = [
  { id: "u1", usuario: "riki", password: "roshan2026", nombre: "Riki" },
];

// ---------------------------------------------------------------------------
// Clientes
// ---------------------------------------------------------------------------

export const CLIENTES: Cliente[] = [
  {
    id: "c1",
    nombre: "Valentina",
    apellido: "Ruiz",
    telefono: "+54 9 11 5521-8890",
    email: "valen.ruiz@mail.com",
    fechaNacimiento: "1991-03-14",
    observaciones: "Presión fuerte. Prefiere aceite de lavanda.",
  },
  {
    id: "c2",
    nombre: "Martín",
    apellido: "Sosa",
    telefono: "+54 9 11 4478-1120",
    email: "m.sosa@mail.com",
    fechaNacimiento: "1985-07-02",
    observaciones: "Piedras calientes, música baja. Llega 10 min antes.",
  },
  {
    id: "c3",
    nombre: "Lucía",
    apellido: "Ferrari",
    telefono: "+54 9 11 6690-3345",
    email: "lucia.f@mail.com",
    fechaNacimiento: "1996-11-25",
    observaciones: "Drenaje suave. Sensible en zona abdominal.",
  },
  {
    id: "c4",
    nombre: "Camila",
    apellido: "Ortiz",
    telefono: "+54 9 11 3312-7788",
    email: "cami.ortiz@mail.com",
    fechaNacimiento: "1989-01-09",
    observaciones: "Siempre sesiones de 90 minutos.",
  },
  {
    id: "c5",
    nombre: "Julián",
    apellido: "Paz",
    telefono: "+54 9 11 2245-9901",
    email: "julian.paz@mail.com",
    fechaNacimiento: "1993-05-30",
    observaciones: "Foco en zona lumbar. Deportista.",
  },
  {
    id: "c6",
    nombre: "Rocío",
    apellido: "Medina",
    telefono: "+54 9 11 7789-4432",
    email: "ro.medina@mail.com",
    fechaNacimiento: "1990-09-18",
    observaciones: "Reflexología podal. Alergia a esencias cítricas.",
  },
  {
    id: "c7",
    nombre: "Diego",
    apellido: "Arce",
    telefono: "+54 9 11 5567-2214",
    email: "d.arce@mail.com",
    fechaNacimiento: "1978-12-04",
    observaciones: "Presión media. Suele reprogramar.",
  },
  {
    id: "c8",
    nombre: "Sofía",
    apellido: "Navarro",
    telefono: "+54 9 11 8834-5567",
    email: "sofi.nav@mail.com",
    fechaNacimiento: "1999-06-21",
    observaciones: "Aromaterapia cítrica. Primera vez en el estudio.",
  },
  {
    id: "c9",
    nombre: "Elena",
    apellido: "Castro",
    telefono: "+54 9 11 6612-0098",
    email: "elena.castro@mail.com",
    fechaNacimiento: "1972-02-16",
    observaciones: "Cliente frecuente. Té de jazmín al finalizar.",
  },
  {
    id: "c10",
    nombre: "Tomás",
    apellido: "Vega",
    telefono: "+54 9 11 3390-6721",
    email: "t.vega@mail.com",
    fechaNacimiento: "1994-10-11",
    observaciones: "Post entrenamiento. Reserva los martes.",
  },
];

// ---------------------------------------------------------------------------
// Servicios
// ---------------------------------------------------------------------------

export const SERVICIOS: Servicio[] = [
  {
    id: "s1",
    nombre: "Masaje descontracturante",
    precio: 28000,
    duracion: 60,
    descripcion: "Trabajo profundo sobre nudos musculares de espalda, cuello y hombros.",
    categoria: "Terapéutico",
    activo: true,
  },
  {
    id: "s2",
    nombre: "Relajante full body",
    precio: 38000,
    duracion: 90,
    descripcion: "Maniobras suaves de cuerpo completo con aceites tibios de almendras.",
    categoria: "Relajación",
    activo: true,
  },
  {
    id: "s3",
    nombre: "Piedras calientes",
    precio: 42000,
    duracion: 90,
    descripcion: "Terapia con piedras volcánicas para liberar tensión profunda.",
    categoria: "Premium",
    activo: true,
  },
  {
    id: "s4",
    nombre: "Drenaje linfático",
    precio: 30000,
    duracion: 60,
    descripcion: "Técnica rítmica para estimular la circulación y reducir retención.",
    categoria: "Terapéutico",
    activo: true,
  },
  {
    id: "s5",
    nombre: "Masaje deportivo",
    precio: 32000,
    duracion: 60,
    descripcion: "Preparación y recuperación muscular para rutinas de alta intensidad.",
    categoria: "Terapéutico",
    activo: true,
  },
  {
    id: "s6",
    nombre: "Reflexología",
    precio: 22000,
    duracion: 60,
    descripcion: "Estimulación de puntos reflejos en pies y manos.",
    categoria: "Relajación",
    activo: true,
  },
  {
    id: "s7",
    nombre: "Ritual de aromaterapia",
    precio: 45000,
    duracion: 90,
    descripcion: "Sesión sensorial con esencias seleccionadas y masaje envolvente.",
    categoria: "Premium",
    activo: true,
  },
  {
    id: "s8",
    nombre: "Masaje craneofacial",
    precio: 18000,
    duracion: 30,
    descripcion: "Alivio de tensión mandibular y cefaleas por estrés.",
    categoria: "Relajación",
    activo: false,
  },
];

// ---------------------------------------------------------------------------
// Turnos (semana del lunes 31 de agosto al sábado 5 de septiembre de 2026)
// ---------------------------------------------------------------------------

const LUNES = inicioSemana(HOY); // 2026-08-31
const D = (n: number) => sumarDias(LUNES, n);

export const TURNOS: Turno[] = [
  { id: "t1", clienteId: "c1", servicioId: "s1", fecha: D(0), hora: "09:30", estado: "realizado" },
  { id: "t2", clienteId: "c2", servicioId: "s3", fecha: D(0), hora: "11:30", estado: "realizado" },
  { id: "t3", clienteId: "c3", servicioId: "s4", fecha: D(0), hora: "16:00", estado: "ausente" },
  { id: "t4", clienteId: "c4", servicioId: "s2", fecha: D(1), hora: "10:00", estado: "realizado" },
  { id: "t5", clienteId: "c10", servicioId: "s5", fecha: D(1), hora: "14:30", estado: "realizado" },
  { id: "t6", clienteId: "c6", servicioId: "s6", fecha: D(1), hora: "17:00", estado: "cancelado" },
  { id: "t7", clienteId: "c9", servicioId: "s3", fecha: D(2), hora: "09:30", estado: "reservado" },
  { id: "t8", clienteId: "c5", servicioId: "s5", fecha: D(2), hora: "12:00", estado: "reservado" },
  { id: "t9", clienteId: "c8", servicioId: "s7", fecha: D(2), hora: "16:30", estado: "reservado" },
  { id: "t10", clienteId: "c7", servicioId: "s1", fecha: D(3), hora: "10:00", estado: "reservado" },
  { id: "t11", clienteId: "c1", servicioId: "s2", fecha: D(3), hora: "15:00", estado: "reservado" },
  { id: "t12", clienteId: "c4", servicioId: "s4", fecha: D(4), hora: "09:30", estado: "reservado" },
  { id: "t13", clienteId: "c3", servicioId: "s6", fecha: D(4), hora: "13:00", estado: "reservado" },
  { id: "t14", clienteId: "c9", servicioId: "s7", fecha: D(4), hora: "17:00", estado: "reservado" },
  { id: "t15", clienteId: "c2", servicioId: "s1", fecha: D(5), hora: "10:30", estado: "reservado" },
  { id: "t16", clienteId: "c6", servicioId: "s2", fecha: D(5), hora: "14:00", estado: "reservado" },
];

// ---------------------------------------------------------------------------
// Pagos
// ---------------------------------------------------------------------------

export const PAGOS: Pago[] = [
  { id: "p1", turnoId: "t1", fecha: D(0), tipo: "Pago", medio: "Transferencia", monto: 28000 },
  { id: "p2", turnoId: "t2", fecha: D(0), tipo: "Seña", medio: "Transferencia", monto: 15000 },
  { id: "p3", turnoId: "t2", fecha: D(0), tipo: "Pago", medio: "Efectivo", monto: 27000 },
  { id: "p4", turnoId: "t4", fecha: D(1), tipo: "Pago", medio: "Débito", monto: 38000 },
  { id: "p5", turnoId: "t5", fecha: D(1), tipo: "Seña", medio: "Efectivo", monto: 12000 },
  { id: "p6", turnoId: "t7", fecha: D(1), tipo: "Seña", medio: "Transferencia", monto: 20000 },
  { id: "p7", turnoId: "t9", fecha: D(2), tipo: "Seña", medio: "Crédito", monto: 15000 },
  { id: "p8", turnoId: "t11", fecha: D(2), tipo: "Seña", medio: "Efectivo", monto: 10000 },
  { id: "p9", turnoId: "t14", fecha: D(3), tipo: "Seña", medio: "Débito", monto: 20000 },
];

// ---------------------------------------------------------------------------
// Atenciones (registro de la sesión efectivamente realizada)
// ---------------------------------------------------------------------------

export const ATENCIONES: Atencion[] = [
  {
    id: "a1",
    turnoId: "t1",
    fecha: D(0),
    observaciones: "Mucha tensión cervical. Se sugirió repetir en 15 días.",
  },
  { id: "a2", turnoId: "t2", fecha: D(0), observaciones: "Sesión completa sin observaciones." },
  { id: "a3", turnoId: "t4", fecha: D(1), observaciones: "Pidió menos presión en piernas." },
  { id: "a4", turnoId: "t5", fecha: D(1), observaciones: "Recuperación post maratón." },
];

// ---------------------------------------------------------------------------
// Bloqueos de horario
// ---------------------------------------------------------------------------

export const BLOQUEOS_HORARIO: BloqueoHorario[] = [
  { id: "b1", fecha: D(2), horaInicio: "13:00", horaFin: "14:00", motivo: "Almuerzo" },
  { id: "b2", fecha: D(3), horaInicio: "17:00", horaFin: "18:30", motivo: "Turno personal" },
  { id: "b3", fecha: D(5), horaInicio: "12:00", horaFin: "13:00", motivo: "Limpieza de sala" },
];

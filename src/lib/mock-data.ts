export type Turno = {
  id: string;
  cliente: string;
  servicio: string;
  dia: number; // 0 = lunes
  inicio: string; // "09:00"
  duracion: number; // en franjas de 30 min
  estado: "confirmado" | "pendiente" | "cancelado";
};

export const DIAS = [
  { nombre: "Lunes", fecha: "1 sep" },
  { nombre: "Martes", fecha: "2 sep" },
  { nombre: "Miércoles", fecha: "3 sep" },
  { nombre: "Jueves", fecha: "4 sep" },
  { nombre: "Viernes", fecha: "5 sep" },
  { nombre: "Sábado", fecha: "6 sep" },
];

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

export const TURNOS: Turno[] = [
  { id: "t1", cliente: "Valentina Ruiz", servicio: "Masaje descontracturante", dia: 0, inicio: "09:30", duracion: 2, estado: "confirmado" },
  { id: "t2", cliente: "Martín Sosa", servicio: "Piedras calientes", dia: 0, inicio: "11:30", duracion: 3, estado: "confirmado" },
  { id: "t3", cliente: "Lucía Ferrari", servicio: "Drenaje linfático", dia: 0, inicio: "16:00", duracion: 2, estado: "pendiente" },
  { id: "t4", cliente: "Camila Ortiz", servicio: "Relajante full body", dia: 1, inicio: "10:00", duracion: 3, estado: "confirmado" },
  { id: "t5", cliente: "Julián Paz", servicio: "Masaje deportivo", dia: 1, inicio: "14:30", duracion: 2, estado: "confirmado" },
  { id: "t6", cliente: "Rocío Medina", servicio: "Reflexología", dia: 2, inicio: "09:00", duracion: 2, estado: "confirmado" },
  { id: "t7", cliente: "Diego Arce", servicio: "Masaje descontracturante", dia: 2, inicio: "12:00", duracion: 2, estado: "cancelado" },
  { id: "t8", cliente: "Sofía Navarro", servicio: "Ritual de aromaterapia", dia: 2, inicio: "17:00", duracion: 3, estado: "pendiente" },
  { id: "t9", cliente: "Elena Castro", servicio: "Piedras calientes", dia: 3, inicio: "10:30", duracion: 3, estado: "confirmado" },
  { id: "t10", cliente: "Tomás Vega", servicio: "Masaje deportivo", dia: 3, inicio: "15:30", duracion: 2, estado: "confirmado" },
  { id: "t11", cliente: "Paula Giménez", servicio: "Relajante full body", dia: 4, inicio: "09:30", duracion: 3, estado: "confirmado" },
  { id: "t12", cliente: "Iván Molina", servicio: "Drenaje linfático", dia: 4, inicio: "13:00", duracion: 2, estado: "pendiente" },
  { id: "t13", cliente: "Ana Beltrán", servicio: "Ritual de aromaterapia", dia: 4, inicio: "17:30", duracion: 2, estado: "confirmado" },
  { id: "t14", cliente: "Nadia Ríos", servicio: "Reflexología", dia: 5, inicio: "10:00", duracion: 2, estado: "confirmado" },
  { id: "t15", cliente: "Gonzalo Ferro", servicio: "Masaje descontracturante", dia: 5, inicio: "12:30", duracion: 2, estado: "confirmado" },
];

export type Cliente = {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  sesiones: number;
  ultimaVisita: string;
  preferencia: string;
  estado: "activo" | "nuevo" | "inactivo";
};

export const CLIENTES: Cliente[] = [
  { id: "c1", nombre: "Valentina Ruiz", telefono: "+54 9 11 5521-8890", email: "valen.ruiz@mail.com", sesiones: 24, ultimaVisita: "1 sep 2026", preferencia: "Presión fuerte, aceite de lavanda", estado: "activo" },
  { id: "c2", nombre: "Martín Sosa", telefono: "+54 9 11 4478-1120", email: "m.sosa@mail.com", sesiones: 12, ultimaVisita: "1 sep 2026", preferencia: "Piedras calientes, música baja", estado: "activo" },
  { id: "c3", nombre: "Lucía Ferrari", telefono: "+54 9 11 6690-3345", email: "lucia.f@mail.com", sesiones: 3, ultimaVisita: "28 ago 2026", preferencia: "Drenaje suave", estado: "nuevo" },
  { id: "c4", nombre: "Camila Ortiz", telefono: "+54 9 11 3312-7788", email: "cami.ortiz@mail.com", sesiones: 31, ultimaVisita: "2 sep 2026", preferencia: "Sesión de 90 min", estado: "activo" },
  { id: "c5", nombre: "Julián Paz", telefono: "+54 9 11 2245-9901", email: "julian.paz@mail.com", sesiones: 8, ultimaVisita: "2 sep 2026", preferencia: "Foco en zona lumbar", estado: "activo" },
  { id: "c6", nombre: "Rocío Medina", telefono: "+54 9 11 7789-4432", email: "ro.medina@mail.com", sesiones: 17, ultimaVisita: "3 sep 2026", preferencia: "Reflexología podal", estado: "activo" },
  { id: "c7", nombre: "Diego Arce", telefono: "+54 9 11 5567-2214", email: "d.arce@mail.com", sesiones: 5, ultimaVisita: "12 jun 2026", preferencia: "Presión media", estado: "inactivo" },
  { id: "c8", nombre: "Sofía Navarro", telefono: "+54 9 11 8834-5567", email: "sofi.nav@mail.com", sesiones: 2, ultimaVisita: "3 sep 2026", preferencia: "Aromaterapia cítrica", estado: "nuevo" },
  { id: "c9", nombre: "Elena Castro", telefono: "+54 9 11 6612-0098", email: "elena.castro@mail.com", sesiones: 40, ultimaVisita: "4 sep 2026", preferencia: "Cliente VIP, té de jazmín", estado: "activo" },
  { id: "c10", nombre: "Tomás Vega", telefono: "+54 9 11 3390-6721", email: "t.vega@mail.com", sesiones: 9, ultimaVisita: "4 sep 2026", preferencia: "Post entrenamiento", estado: "activo" },
];

export type Servicio = {
  id: string;
  nombre: string;
  descripcion: string;
  duracion: number;
  precio: number;
  categoria: string;
  activo: boolean;
};

export const SERVICIOS: Servicio[] = [
  { id: "s1", nombre: "Masaje descontracturante", descripcion: "Trabajo profundo sobre nudos musculares de espalda, cuello y hombros.", duracion: 60, precio: 28000, categoria: "Terapéutico", activo: true },
  { id: "s2", nombre: "Relajante full body", descripcion: "Maniobras suaves de cuerpo completo con aceites tibios de almendras.", duracion: 90, precio: 38000, categoria: "Relajación", activo: true },
  { id: "s3", nombre: "Piedras calientes", descripcion: "Terapia con piedras volcánicas para liberar tensión profunda.", duracion: 90, precio: 42000, categoria: "Premium", activo: true },
  { id: "s4", nombre: "Drenaje linfático", descripcion: "Técnica rítmica para estimular la circulación y reducir retención.", duracion: 60, precio: 30000, categoria: "Terapéutico", activo: true },
  { id: "s5", nombre: "Masaje deportivo", descripcion: "Preparación y recuperación muscular para rutinas de alta intensidad.", duracion: 60, precio: 32000, categoria: "Terapéutico", activo: true },
  { id: "s6", nombre: "Reflexología", descripcion: "Estimulación de puntos reflejos en pies y manos.", duracion: 45, precio: 22000, categoria: "Relajación", activo: true },
  { id: "s7", nombre: "Ritual de aromaterapia", descripcion: "Sesión sensorial con esencias seleccionadas y masaje envolvente.", duracion: 90, precio: 45000, categoria: "Premium", activo: true },
  { id: "s8", nombre: "Masaje craneofacial", descripcion: "Alivio de tensión mandibular y cefaleas por estrés.", duracion: 30, precio: 18000, categoria: "Relajación", activo: false },
];

export type Pago = {
  id: string;
  cliente: string;
  servicio: string;
  fecha: string;
  monto: number;
  metodo: "Efectivo" | "Transferencia" | "Tarjeta" | "MercadoPago";
  estado: "cobrado" | "pendiente" | "reembolsado";
};

export const PAGOS: Pago[] = [
  { id: "p1", cliente: "Valentina Ruiz", servicio: "Masaje descontracturante", fecha: "1 sep 2026", monto: 28000, metodo: "Transferencia", estado: "cobrado" },
  { id: "p2", cliente: "Martín Sosa", servicio: "Piedras calientes", fecha: "1 sep 2026", monto: 42000, metodo: "MercadoPago", estado: "cobrado" },
  { id: "p3", cliente: "Lucía Ferrari", servicio: "Drenaje linfático", fecha: "1 sep 2026", monto: 30000, metodo: "Efectivo", estado: "pendiente" },
  { id: "p4", cliente: "Camila Ortiz", servicio: "Relajante full body", fecha: "2 sep 2026", monto: 38000, metodo: "Tarjeta", estado: "cobrado" },
  { id: "p5", cliente: "Julián Paz", servicio: "Masaje deportivo", fecha: "2 sep 2026", monto: 32000, metodo: "Efectivo", estado: "cobrado" },
  { id: "p6", cliente: "Rocío Medina", servicio: "Reflexología", fecha: "3 sep 2026", monto: 22000, metodo: "Transferencia", estado: "cobrado" },
  { id: "p7", cliente: "Diego Arce", servicio: "Masaje descontracturante", fecha: "3 sep 2026", monto: 28000, metodo: "MercadoPago", estado: "reembolsado" },
  { id: "p8", cliente: "Sofía Navarro", servicio: "Ritual de aromaterapia", fecha: "3 sep 2026", monto: 45000, metodo: "Tarjeta", estado: "pendiente" },
  { id: "p9", cliente: "Elena Castro", servicio: "Piedras calientes", fecha: "4 sep 2026", monto: 42000, metodo: "Transferencia", estado: "cobrado" },
  { id: "p10", cliente: "Tomás Vega", servicio: "Masaje deportivo", fecha: "4 sep 2026", monto: 32000, metodo: "Efectivo", estado: "cobrado" },
];

export const formatoMoneda = (valor: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(valor);

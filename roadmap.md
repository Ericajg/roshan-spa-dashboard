# Roadmap — Panel ROSHAN MASAJES

Sistema administrativo para un único usuario (Riki). Solo interfaz, datos ficticios.
Entidades fijas: Usuario, Cliente, Servicio, Turno, Pago, Atencion, Bloqueo_Horario.

## Hecho

- [x] Estados de turno diferenciados por color elegante (reservado/realizado/cancelado/ausente)
- [x] Modelo de datos ficticio con las 7 entidades definitivas
- [x] Sesión ficticia (usuario único) + pantalla de Login
- [x] Sidebar con Agenda, Clientes, Servicios, Pagos, Configuración, Cerrar sesión
- [x] Agenda: vista diaria y semanal, cambio de fecha, horarios libres, bloqueos
- [x] Agenda: modal de turno con detalle, pago, marcar realizado, cancelar
- [x] Nuevo turno con confirmación y control de disponibilidad
- [x] Bloqueo de horarios desde Agenda
- [x] Clientes: búsqueda, alta, edición, ficha con historial
- [x] Servicios: alta, edición, activar/desactivar (inactivos no se ofrecen en turnos)
- [x] Pagos: 4 tarjetas resumen + tabla de movimientos (tipo y medio definidos)
- [x] Tarjetas de gestión diaria en Agenda

## Pendiente (fuera de esta etapa)

- [ ] Conexión a API Flask + SQL Server (recién cuando la interfaz esté aprobada)

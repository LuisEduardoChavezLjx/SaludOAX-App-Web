# Contrato de DTOs — saludOax

Este documento es el acuerdo entre ambos integrantes sobre los campos exactos
que expondra el backend y consumira el frontend. Si algo cambia aqui, se
avisa al otro integrante ANTES de tocar el codigo — es la unica razon por la
que no deberian bloquearse durante el desarrollo.

## Auth (ya implementado en Fase 0)

### POST /api/auth/register
Request:
```json
{
  "email": "paciente@correo.com",
  "password": "Passw0rd!",
  "rol": "PACIENTE"
}
```
Response (201):
```json
{
  "token": "jwt...",
  "email": "paciente@correo.com",
  "rol": "PACIENTE"
}
```

### POST /api/auth/login
Request:
```json
{ "email": "paciente@correo.com", "password": "Passw0rd!" }
```
Response (200): igual formato que register.

---

## Paciente (Flujo A — Integrante 1)

```json
{
  "id": 1,
  "nombre": "Juan Perez",
  "telefono": "9511234567",
  "peso": "72kg",
  "presion": "120/80",
  "contextoSalud": "Dolor de cabeza persistente desde hace 2 dias"
}
```

## Medico (Flujo B — Integrante 2)

```json
{
  "id": 1,
  "nombre": "Dra. Ana Gomez",
  "especialidad": "Medicina General",
  "disponible": true
}
```

## Cita (Flujo A crea, Flujo B lee)

```json
{
  "id": 10,
  "pacienteId": 1,
  "pacienteNombre": "Juan Perez",
  "medicoId": 1,
  "fechaHora": "2026-07-25T10:30:00",
  "estado": "PENDIENTE",
  "peso": "72kg",
  "presion": "120/80",
  "contextoSalud": "Dolor de cabeza persistente desde hace 2 dias"
}
```
Valores posibles de `estado`: `PENDIENTE`, `CONFIRMADA`, `CANCELADA`, `ATENDIDA`.

## Estimacion (Flujo B — generada por IA a partir de una Cita)

```json
{
  "id": 5,
  "citaId": 10,
  "tiempoEstimadoMin": 15,
  "gravedad": "MODERADA"
}
```
Valores posibles de `gravedad`: `LEVE`, `MODERADA`, `URGENTE`.

---

## Reglas del contrato

1. Ningun endpoint devuelve la entidad JPA directa — siempre un DTO con estos campos.
2. Si necesitas un campo nuevo, lo agregas aqui primero y avisas al otro antes de programar contra el.
3. Los nombres de campo son en `camelCase` en JSON (aunque la columna en MySQL sea `snake_case`).
4. Mientras Flujo A no tenga el endpoint real de Citas listo, Flujo B puede trabajar contra el seed de datos de prueba usando estos mismos campos.

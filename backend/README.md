# saludOax — Backend

Backend de saludOax en Spring Boot. Implementa Fase 0 (fundacion) + Flujo A
(Pacientes y Citas) completos.

## Como correr

1. Crea la base: `CREATE DATABASE saludoax;`
2. Copia `src/main/resources/application.properties.example` como
   `application.properties` y llena tus valores (usuario/password MySQL,
   `jwt.secret`).
3. `./mvnw spring-boot:run`
4. Flyway crea automaticamente: roles, usuarios, pacientes, medicos, citas,
   estimaciones, especialidades (y la tabla N:M `medico_especialidades`).
5. Al arrancar, `DataSeeder` carga datos de prueba automaticamente
   (10 pacientes, 5 medicos, 10 citas, mas el usuario admin).

## Credenciales de prueba (usuario administrador de evaluacion)

| Rol      | Email                     | Password      |
|----------|---------------------------|---------------|
| ADMIN    | admin@saludoax.com        | Admin123!     |
| PACIENTE | paciente1@correo.com      | Paciente123!  |
| MEDICO   | medico1@saludoax.com      | Medico123!    |

## Endpoints disponibles

- `POST /api/auth/register` — registro (rol PACIENTE o MEDICO)
- `POST /api/auth/login` — login, devuelve JWT
- `GET /api/pacientes?page=0&size=10&nombre=` — listado paginado (ADMIN, MEDICO)
- `POST /api/pacientes` — crear perfil de paciente (PACIENTE)
- `GET /api/citas?page=0&size=10&estado=PENDIENTE` — listado paginado (ADMIN, MEDICO)
- `POST /api/citas` — agendar cita (PACIENTE, ADMIN)
- `PATCH /api/citas/{id}/estado` — cambiar estado (cancelar, confirmar, etc.)
- `GET /api/citas/{id}/posicion-fila` — posicion en fila (usado por Flujo B)

## Diagrama ER

Ver `DTO_CONTRACT.md` para el contrato de campos exacto entre backend y
frontend, y el diagrama ER acordado en la Fase 0.

## Relacion N:M

`medicos` — `especialidades` a traves de la tabla intermedia
`medico_especialidades` (un medico puede tener varias especialidades, una
especialidad puede tener varios medicos).

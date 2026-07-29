# Despliegue — saludoax.me

VPS compartido (Azure, Ubuntu 24.04, varias actividades de equipo corriendo a la vez).
MariaDB del sistema ya estaba en uso por otras actividades — no se toca. MySQL 8 para
este proyecto corre en Docker, aislado, en `127.0.0.1:3307` (nunca expuesto a internet).

## Componentes

- `docker-compose.prod.yml` — MySQL 8 en Docker, en `~/saludoax/db/` en el VPS, con un
  `.env` real (no versionado) al lado con las contraseñas de producción
- `saludoax-backend.service` — systemd unit, `EnvironmentFile` con secretos reales en
  `~/saludoax/app/app.env` (no versionado), corre `backend.jar` en el puerto 8095
  (solo `127.0.0.1`, sin regla de firewall porque nginx lo alcanza por localhost)
- `nginx-saludoax.conf.snippet` — bloque agregado al vhost HTTPS ya existente de
  Certbot en `/etc/nginx/sites-available/default`, sirve el frontend estático y
  redirige `/api/` al backend

## Variables reales que viven solo en el VPS (nunca en git)

- `~/saludoax/db/.env`: `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`
- `~/saludoax/app/app.env`: `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`,
  `SPRING_DATASOURCE_PASSWORD`, `JWT_SECRET`, `APP_IA_API_KEY`, `GMAIL_USER`, `GMAIL_PASS`

## Redeploy (cambios de código)

```bash
# backend
cd backend && ./mvnw package -DskipTests
scp target/backend-*.jar azure:~/saludoax/app/backend.jar
ssh azure "sudo systemctl restart saludoax-backend"

# frontend
cd frontend && VITE_API_BASE_URL=/api npx vite build
scp -r dist/* azure:/var/www/saludoax/
ssh azure "sudo chown -R www-data:www-data /var/www/saludoax"
```

-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: saludoax
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `citas`
--

DROP TABLE IF EXISTS `citas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `citas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `paciente_id` bigint NOT NULL,
  `medico_id` bigint NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `estado` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDIENTE',
  `peso_kg` decimal(5,2) DEFAULT NULL,
  `presion_sistolica` int DEFAULT NULL,
  `presion_diastolica` int DEFAULT NULL,
  `contexto_salud` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_citas_medico_fecha` (`medico_id`,`fecha_hora`),
  KEY `idx_citas_paciente` (`paciente_id`),
  CONSTRAINT `fk_citas_medico` FOREIGN KEY (`medico_id`) REFERENCES `medicos` (`id`),
  CONSTRAINT `fk_citas_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`),
  CONSTRAINT `chk_citas_diastolica` CHECK (((`presion_diastolica` is null) or (`presion_diastolica` between 30 and 200))),
  CONSTRAINT `chk_citas_estado` CHECK ((`estado` in (_utf8mb4'PENDIENTE',_utf8mb4'CONFIRMADA',_utf8mb4'CANCELADA',_utf8mb4'ATENDIDA'))),
  CONSTRAINT `chk_citas_peso` CHECK (((`peso_kg` is null) or (`peso_kg` between 1 and 400))),
  CONSTRAINT `chk_citas_sistolica` CHECK (((`presion_sistolica` is null) or (`presion_sistolica` between 50 and 300)))
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `citas`
--

LOCK TABLES `citas` WRITE;
/*!40000 ALTER TABLE `citas` DISABLE KEYS */;
INSERT INTO `citas` VALUES (1,1,1,'2026-07-28 22:07:45','PENDIENTE',61.00,118,76,'Consulta de rutina, sin molestias','2026-07-27 22:07:45'),(2,2,2,'2026-07-28 23:07:45','PENDIENTE',62.00,122,80,'Dolor de rodilla al caminar desde hace dos semanas','2026-07-27 22:07:45'),(3,3,3,'2026-07-29 00:07:45','PENDIENTE',63.00,145,92,'Dolor de cabeza persistente y vision borrosa','2026-07-27 22:07:45'),(4,4,4,'2026-07-29 01:07:45','PENDIENTE',64.00,130,84,'Fiebre y tos desde hace tres dias','2026-07-27 22:07:45'),(5,5,5,'2026-07-29 02:07:45','PENDIENTE',65.00,185,125,'Mareo intenso, zumbido en oidos y dolor en el pecho','2026-07-27 22:07:45'),(6,6,1,'2026-07-29 03:07:45','PENDIENTE',66.00,110,70,'Revision anual de control','2026-07-27 22:07:45'),(7,7,2,'2026-07-29 04:07:45','PENDIENTE',67.00,128,82,'Molestia estomacal despues de comer','2026-07-27 22:07:45'),(8,8,3,'2026-07-29 05:07:45','PENDIENTE',68.00,152,95,'Falta de aire al subir escaleras','2026-07-27 22:07:45'),(9,9,4,'2026-07-29 06:07:45','PENDIENTE',69.00,120,78,'Erupcion en la piel del antebrazo','2026-07-27 22:07:45'),(10,10,5,'2026-07-29 07:07:45','PENDIENTE',70.00,138,88,'Control de crecimiento y vacunas','2026-07-27 22:07:45'),(11,1,1,'2026-07-29 23:12:34','PENDIENTE',70.00,190,125,'Dolor de pecho intenso','2026-07-27 23:12:35'),(12,2,1,'2026-07-29 23:13:51','PENDIENTE',80.00,195,130,'prueba fallback','2026-07-27 23:13:51'),(13,3,1,'2026-07-29 00:07:48','ATENDIDA',65.00,120,80,'chequeo rutinario','2026-07-28 00:07:48'),(14,1,1,'2026-08-05 10:00:00','PENDIENTE',NULL,NULL,NULL,NULL,'2026-07-28 11:30:28'),(15,1,1,'2026-08-06 09:00:00','PENDIENTE',NULL,200,130,'dolor de cabeza intenso','2026-07-28 18:03:56');
/*!40000 ALTER TABLE `citas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `especialidades`
--

DROP TABLE IF EXISTS `especialidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `especialidades` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `especialidades`
--

LOCK TABLES `especialidades` WRITE;
/*!40000 ALTER TABLE `especialidades` DISABLE KEYS */;
INSERT INTO `especialidades` VALUES (4,'Cardiologia'),(5,'Dermatologia'),(3,'Ginecologia'),(1,'Medicina General'),(2,'Pediatria'),(6,'Traumatologia');
/*!40000 ALTER TABLE `especialidades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estimaciones`
--

DROP TABLE IF EXISTS `estimaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estimaciones` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cita_id` bigint NOT NULL,
  `tiempo_estimado_min` int NOT NULL,
  `gravedad` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_estimaciones_cita` (`cita_id`),
  CONSTRAINT `fk_estimaciones_cita` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id`),
  CONSTRAINT `chk_estimaciones_gravedad` CHECK ((`gravedad` in (_utf8mb4'LEVE',_utf8mb4'MODERADA',_utf8mb4'URGENTE')))
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estimaciones`
--

LOCK TABLES `estimaciones` WRITE;
/*!40000 ALTER TABLE `estimaciones` DISABLE KEYS */;
INSERT INTO `estimaciones` VALUES (1,11,15,'URGENTE','2026-07-27 23:12:37'),(2,12,30,'URGENTE','2026-07-27 23:13:52'),(3,4,15,'LEVE','2026-07-27 23:30:34'),(4,2,15,'LEVE','2026-07-27 23:31:24'),(5,13,15,'LEVE','2026-07-28 00:07:49'),(6,1,15,'LEVE','2026-07-28 00:50:47'),(7,3,30,'MODERADA','2026-07-28 07:35:22'),(8,14,15,'LEVE','2026-07-28 17:43:53'),(9,15,30,'URGENTE','2026-07-28 18:03:57');
/*!40000 ALTER TABLE `estimaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flyway_schema_history`
--

DROP TABLE IF EXISTS `flyway_schema_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flyway_schema_history` (
  `installed_rank` int NOT NULL,
  `version` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `script` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` int DEFAULT NULL,
  `installed_by` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `installed_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `execution_time` int NOT NULL,
  `success` tinyint(1) NOT NULL,
  PRIMARY KEY (`installed_rank`),
  KEY `flyway_schema_history_s_idx` (`success`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flyway_schema_history`
--

LOCK TABLES `flyway_schema_history` WRITE;
/*!40000 ALTER TABLE `flyway_schema_history` DISABLE KEYS */;
INSERT INTO `flyway_schema_history` VALUES (1,'1','create roles table','SQL','V1__create_roles_table.sql',477947840,'saludoax','2026-07-28 04:07:37',36,1),(2,'2','create usuarios table','SQL','V2__create_usuarios_table.sql',1411659517,'saludoax','2026-07-28 04:07:37',69,1),(3,'3','create pacientes table','SQL','V3__create_pacientes_table.sql',-1551621856,'saludoax','2026-07-28 04:07:37',38,1),(4,'4','create medicos table','SQL','V4__create_medicos_table.sql',-1464677828,'saludoax','2026-07-28 04:07:37',40,1),(5,'5','create citas table','SQL','V5__create_citas_table.sql',20613710,'saludoax','2026-07-28 04:07:37',131,1),(6,'6','create estimaciones table','SQL','V6__create_estimaciones_table.sql',-846970948,'saludoax','2026-07-28 04:07:37',65,1),(7,'7','create especialidades nm','SQL','V7__create_especialidades_nm.sql',-1586346830,'saludoax','2026-07-28 04:07:37',78,1),(8,'8','vitales numericos','SQL','V8__vitales_numericos.sql',1317480227,'saludoax','2026-07-28 04:07:38',458,1),(9,'9','auth seguridad','SQL','V9__auth_seguridad.sql',-317744508,'saludoax','2026-07-28 04:07:38',203,1),(10,'10','admin panel','SQL','V10__admin_panel.sql',1230542841,'saludoax','2026-07-28 04:07:38',292,1),(11,'11','create turnos sala espera table','SQL','V11__create_turnos_sala_espera_table.sql',1342559678,'saludoax','2026-07-28 04:07:38',69,1);
/*!40000 ALTER TABLE `flyway_schema_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horarios_medico`
--

DROP TABLE IF EXISTS `horarios_medico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horarios_medico` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `medico_id` bigint NOT NULL,
  `dia_semana` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_horarios_medico` (`medico_id`),
  CONSTRAINT `fk_horarios_medico` FOREIGN KEY (`medico_id`) REFERENCES `medicos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horarios_medico`
--

LOCK TABLES `horarios_medico` WRITE;
/*!40000 ALTER TABLE `horarios_medico` DISABLE KEYS */;
INSERT INTO `horarios_medico` VALUES (1,1,'LUNES','08:00:00','14:00:00'),(2,1,'MARTES','08:00:00','14:00:00'),(3,1,'MIERCOLES','08:00:00','14:00:00'),(4,1,'JUEVES','08:00:00','14:00:00'),(5,1,'VIERNES','08:00:00','14:00:00'),(6,2,'LUNES','13:00:00','19:00:00'),(7,2,'MARTES','13:00:00','19:00:00'),(8,2,'MIERCOLES','13:00:00','19:00:00'),(9,2,'JUEVES','13:00:00','19:00:00'),(10,2,'VIERNES','13:00:00','19:00:00'),(11,3,'LUNES','08:00:00','14:00:00'),(12,3,'MARTES','08:00:00','14:00:00'),(13,3,'MIERCOLES','08:00:00','14:00:00'),(14,3,'JUEVES','08:00:00','14:00:00'),(15,3,'VIERNES','08:00:00','14:00:00'),(16,4,'LUNES','13:00:00','19:00:00'),(17,4,'MARTES','13:00:00','19:00:00'),(18,4,'MIERCOLES','13:00:00','19:00:00'),(19,4,'JUEVES','13:00:00','19:00:00'),(20,4,'VIERNES','13:00:00','19:00:00'),(21,5,'LUNES','08:00:00','14:00:00'),(22,5,'MARTES','08:00:00','14:00:00'),(23,5,'MIERCOLES','08:00:00','14:00:00'),(24,5,'JUEVES','08:00:00','14:00:00'),(25,5,'VIERNES','08:00:00','14:00:00');
/*!40000 ALTER TABLE `horarios_medico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medico_especialidades`
--

DROP TABLE IF EXISTS `medico_especialidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medico_especialidades` (
  `medico_id` bigint NOT NULL,
  `especialidad_id` bigint NOT NULL,
  PRIMARY KEY (`medico_id`,`especialidad_id`),
  KEY `fk_me_especialidad` (`especialidad_id`),
  CONSTRAINT `fk_me_especialidad` FOREIGN KEY (`especialidad_id`) REFERENCES `especialidades` (`id`),
  CONSTRAINT `fk_me_medico` FOREIGN KEY (`medico_id`) REFERENCES `medicos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medico_especialidades`
--

LOCK TABLES `medico_especialidades` WRITE;
/*!40000 ALTER TABLE `medico_especialidades` DISABLE KEYS */;
INSERT INTO `medico_especialidades` VALUES (4,1),(5,2),(3,3),(1,4),(2,5);
/*!40000 ALTER TABLE `medico_especialidades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicos`
--

DROP TABLE IF EXISTS `medicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `especialidad` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cedula` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `consultorio` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `disponible` tinyint(1) NOT NULL DEFAULT '1',
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_medicos_usuario` (`usuario_id`),
  CONSTRAINT `fk_medicos_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicos`
--

LOCK TABLES `medicos` WRITE;
/*!40000 ALTER TABLE `medicos` DISABLE KEYS */;
INSERT INTO `medicos` VALUES (1,12,'medico1','Cardiologia',NULL,NULL,1,'2026-07-27 22:07:44'),(2,13,'Dr. Luis Ramirez','Dermatologia',NULL,NULL,1,'2026-07-27 22:07:45'),(3,14,'Dra. Carmen Ruiz','Ginecologia',NULL,NULL,1,'2026-07-27 22:07:45'),(4,15,'Dr. Jorge Diaz','Medicina General',NULL,NULL,1,'2026-07-27 22:07:45'),(5,16,'Dra. Sofia Torres','Pediatria',NULL,NULL,1,'2026-07-27 22:07:45');
/*!40000 ALTER TABLE `medicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pacientes`
--

DROP TABLE IF EXISTS `pacientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pacientes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `peso_kg` decimal(5,2) DEFAULT NULL,
  `presion_sistolica` int DEFAULT NULL,
  `presion_diastolica` int DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `sexo` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contexto_salud` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pacientes_usuario` (`usuario_id`),
  CONSTRAINT `fk_pacientes_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `chk_pacientes_diastolica` CHECK (((`presion_diastolica` is null) or (`presion_diastolica` between 30 and 200))),
  CONSTRAINT `chk_pacientes_peso` CHECK (((`peso_kg` is null) or (`peso_kg` between 1 and 400))),
  CONSTRAINT `chk_pacientes_sexo` CHECK (((`sexo` is null) or (`sexo` in (_utf8mb4'MASCULINO',_utf8mb4'FEMENINO',_utf8mb4'OTRO')))),
  CONSTRAINT `chk_pacientes_sistolica` CHECK (((`presion_sistolica` is null) or (`presion_sistolica` between 50 and 300)))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pacientes`
--

LOCK TABLES `pacientes` WRITE;
/*!40000 ALTER TABLE `pacientes` DISABLE KEYS */;
INSERT INTO `pacientes` VALUES (1,2,'paciente1','9510000001',61.00,118,76,'1992-07-27','MASCULINO','Consulta de rutina, sin molestias','2026-07-27 22:07:43'),(2,3,'Paciente de prueba 2','9510000002',62.00,122,80,'1959-07-27','FEMENINO','Dolor de rodilla al caminar desde hace dos semanas','2026-07-27 22:07:43'),(3,4,'Paciente de prueba 3','9510000003',63.00,145,92,'1981-07-27','MASCULINO','Dolor de cabeza persistente y vision borrosa','2026-07-27 22:07:43'),(4,5,'Paciente de prueba 4','9510000004',64.00,130,84,'2022-07-27','FEMENINO','Fiebre y tos desde hace tres dias','2026-07-27 22:07:44'),(5,6,'Paciente de prueba 5','9510000005',65.00,185,125,'1954-07-27','MASCULINO','Mareo intenso, zumbido en oidos y dolor en el pecho','2026-07-27 22:07:44'),(6,7,'Paciente de prueba 6','9510000006',66.00,110,70,'1998-07-27','FEMENINO','Revision anual de control','2026-07-27 22:07:44'),(7,8,'Paciente de prueba 7','9510000007',67.00,128,82,'1975-07-27','MASCULINO','Molestia estomacal despues de comer','2026-07-27 22:07:44'),(8,9,'Paciente de prueba 8','9510000008',68.00,152,95,'1963-07-27','FEMENINO','Falta de aire al subir escaleras','2026-07-27 22:07:44'),(9,10,'Paciente de prueba 9','9510000009',69.00,120,78,'1987-07-27','MASCULINO','Erupcion en la piel del antebrazo','2026-07-27 22:07:44'),(10,11,'Paciente de prueba 10','95100000010',70.00,138,88,'2020-07-27','FEMENINO','Control de crecimiento y vacunas','2026-07-27 22:07:44');
/*!40000 ALTER TABLE `pacientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMIN'),(3,'MEDICO'),(2,'PACIENTE');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turnos_sala_espera`
--

DROP TABLE IF EXISTS `turnos_sala_espera`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turnos_sala_espera` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cita_id` bigint NOT NULL,
  `estado` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ESPERANDO',
  `hora_llegada` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_turnos_cita` (`cita_id`),
  KEY `idx_turnos_estado` (`estado`),
  CONSTRAINT `fk_turnos_cita` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id`),
  CONSTRAINT `chk_turnos_estado` CHECK ((`estado` in (_utf8mb4'ESPERANDO',_utf8mb4'EN_CONSULTA',_utf8mb4'FINALIZADO')))
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turnos_sala_espera`
--

LOCK TABLES `turnos_sala_espera` WRITE;
/*!40000 ALTER TABLE `turnos_sala_espera` DISABLE KEYS */;
INSERT INTO `turnos_sala_espera` VALUES (1,11,'ESPERANDO','2026-07-27 23:12:37'),(2,12,'ESPERANDO','2026-07-27 23:13:52'),(3,4,'ESPERANDO','2026-07-27 23:30:34'),(4,2,'ESPERANDO','2026-07-27 23:31:25'),(5,13,'FINALIZADO','2026-07-28 00:07:49'),(6,1,'ESPERANDO','2026-07-28 00:50:47'),(7,3,'ESPERANDO','2026-07-28 07:35:22'),(8,14,'ESPERANDO','2026-07-28 17:43:53'),(9,15,'ESPERANDO','2026-07-28 18:03:57');
/*!40000 ALTER TABLE `turnos_sala_espera` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_changed_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rol_id` bigint NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_usuarios_rol` (`rol_id`),
  KEY `idx_usuarios_email` (`email`),
  CONSTRAINT `fk_usuarios_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'admin@saludoax.com','admin','$2a$10$TNpd2GikQfVfLSiEC.PbuOvIbXNCqOl/yhZDLl6mcH02vK7RQ/q5C','2026-07-27 22:07:43',1,1,'2026-07-27 22:07:43'),(2,'paciente1@correo.com','paciente1','$2a$10$uwqk7md6DAq6K47Vw3ncROF.N24dGeSJZz2m5xeC1bZsMF58iYL1S','2026-07-27 22:07:43',2,1,'2026-07-27 22:07:43'),(3,'paciente2@correo.com','paciente2','$2a$10$pVcwWSwBba2lA2pFxZ39Q.brQN5RHHDwE/tfeaOSjkfzUxqbr/tfS','2026-07-27 22:07:43',2,1,'2026-07-27 22:07:43'),(4,'paciente3@correo.com','paciente3','$2a$10$S2hRd3O.1tDZ0yzz6giUC.ugyXdj7ZEZ5mHq.etTtZ5QzV7cFsGSO','2026-07-27 22:07:43',2,1,'2026-07-27 22:07:43'),(5,'paciente4@correo.com','paciente4','$2a$10$eReCc0ZMKI7xLonO48GYe.FV8s6bTMR9xJf4j96Zh8t9B1F/gwxPi','2026-07-27 22:07:43',2,1,'2026-07-27 22:07:43'),(6,'paciente5@correo.com','paciente5','$2a$10$0zrjCnXLbmPK858M0F6FCujuoHGC.C/qR2cOx3TtEB42BYlZAR3w.','2026-07-27 22:07:44',2,1,'2026-07-27 22:07:44'),(7,'paciente6@correo.com','paciente6','$2a$10$3EfXUDKt1/4H79Eifg7KL.5Sg7XGOJ/I4n.8UI8gBR7.hccu5EvVm','2026-07-27 22:07:44',2,1,'2026-07-27 22:07:44'),(8,'paciente7@correo.com','paciente7','$2a$10$LcU.cpFwn0pm7idBF.HEveH/Q647X.XyeZi4kY6T4ct7gAs26M9gm','2026-07-27 22:07:44',2,1,'2026-07-27 22:07:44'),(9,'paciente8@correo.com','paciente8','$2a$10$XMfEmFGrmTtCF16o4YaWCeZ8KFeTDcubAV8k87NldaPWyVmIFZBDS','2026-07-27 22:07:44',2,1,'2026-07-27 22:07:44'),(10,'paciente9@correo.com','paciente9','$2a$10$BFDkZKnDn5kFIQxr0SXltee752y9uQ/hyNol23CTdt0r1os4u6Z06','2026-07-27 22:07:44',2,1,'2026-07-27 22:07:44'),(11,'paciente10@correo.com','paciente10','$2a$10$E/CvkhjZxwETtiiO/dEVEeExJqJD0oKpwHT3wGbA8O7znoEEjWqiC','2026-07-27 22:07:44',2,1,'2026-07-27 22:07:44'),(12,'medico1@saludoax.com','medico1','$2a$10$CBd0EoOmCPjHktpWtozBb.moVZ7NrHutwy4klgWJJ6aaM/7KypPae','2026-07-27 22:07:44',3,1,'2026-07-27 22:07:44'),(13,'medico2@saludoax.com','medico2','$2a$10$SO7KWpz3.U86Pn1tiiVIEedpDrZanv1fQbScZO5Vin5RCer6MwHWm','2026-07-27 22:07:44',3,1,'2026-07-27 22:07:44'),(14,'medico3@saludoax.com','medico3','$2a$10$c2I3aFHE4lPJnE1XZ45MjebOovAIaJG.jelmqOjPul/9QC9DG2P0u','2026-07-27 22:07:45',3,1,'2026-07-27 22:07:45'),(15,'medico4@saludoax.com','medico4','$2a$10$rC6NmGx35jfnD2pU1XSqMuwseT/xk0WEVenMwaAdjEkMCSG8dK46O','2026-07-27 22:07:45',3,1,'2026-07-27 22:07:45'),(16,'medico5@saludoax.com','medico5','$2a$10$wcUCyGgeOuV4Favao4NPgeFPtGDobSYmLAElxlqYC4OCMZ/IwFqom','2026-07-27 22:07:45',3,1,'2026-07-27 22:07:45');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-29  1:47:26

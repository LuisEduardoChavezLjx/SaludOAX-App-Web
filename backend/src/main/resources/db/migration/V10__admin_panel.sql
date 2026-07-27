ALTER TABLE usuarios
    ADD COLUMN nombre VARCHAR(150) NULL AFTER email;

UPDATE usuarios u
LEFT JOIN pacientes p ON p.usuario_id = u.id
LEFT JOIN medicos m ON m.usuario_id = u.id
SET u.nombre = COALESCE(p.nombre, m.nombre, u.email);

ALTER TABLE usuarios
    MODIFY COLUMN nombre VARCHAR(150) NOT NULL;

ALTER TABLE medicos
    ADD COLUMN cedula VARCHAR(20) AFTER especialidad,
    ADD COLUMN consultorio VARCHAR(20) AFTER cedula;

UPDATE medicos SET cedula = CONCAT('CED-', id) WHERE cedula IS NULL;

CREATE TABLE horarios_medico (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    medico_id BIGINT NOT NULL,
    dia_semana VARCHAR(10) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    CONSTRAINT fk_horarios_medico FOREIGN KEY (medico_id) REFERENCES medicos(id) ON DELETE CASCADE
);

CREATE INDEX idx_horarios_medico ON horarios_medico(medico_id);

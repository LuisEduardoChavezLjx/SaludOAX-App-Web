CREATE TABLE especialidades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO especialidades (nombre) VALUES
    ('Medicina General'), ('Pediatria'), ('Ginecologia'),
    ('Cardiologia'), ('Dermatologia'), ('Traumatologia');

-- Relacion N:M: un medico puede tener varias especialidades
-- y una especialidad puede ser atendida por varios medicos.
CREATE TABLE medico_especialidades (
    medico_id BIGINT NOT NULL,
    especialidad_id BIGINT NOT NULL,
    PRIMARY KEY (medico_id, especialidad_id),
    CONSTRAINT fk_me_medico FOREIGN KEY (medico_id) REFERENCES medicos(id),
    CONSTRAINT fk_me_especialidad FOREIGN KEY (especialidad_id) REFERENCES especialidades(id)
);

CREATE TABLE pacientes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    peso VARCHAR(20),
    presion VARCHAR(20),
    contexto_salud VARCHAR(500),
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pacientes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT uq_pacientes_usuario UNIQUE (usuario_id)
);

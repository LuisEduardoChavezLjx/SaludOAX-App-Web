CREATE TABLE estimaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cita_id BIGINT NOT NULL,
    tiempo_estimado_min INT NOT NULL,
    gravedad VARCHAR(20) NOT NULL,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_estimaciones_cita FOREIGN KEY (cita_id) REFERENCES citas(id),
    CONSTRAINT uq_estimaciones_cita UNIQUE (cita_id),
    CONSTRAINT chk_estimaciones_gravedad CHECK (gravedad IN ('LEVE','MODERADA','URGENTE'))
);

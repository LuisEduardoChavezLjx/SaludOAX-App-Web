CREATE TABLE turnos_sala_espera (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cita_id BIGINT NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'ESPERANDO',
    hora_llegada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_turnos_cita FOREIGN KEY (cita_id) REFERENCES citas(id),
    CONSTRAINT uq_turnos_cita UNIQUE (cita_id),
    CONSTRAINT chk_turnos_estado CHECK (estado IN ('ESPERANDO','EN_CONSULTA','FINALIZADO'))
);

CREATE INDEX idx_turnos_estado ON turnos_sala_espera(estado);

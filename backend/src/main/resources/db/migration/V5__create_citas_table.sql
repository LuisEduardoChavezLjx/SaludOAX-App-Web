CREATE TABLE citas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    paciente_id BIGINT NOT NULL,
    medico_id BIGINT NOT NULL,
    fecha_hora DATETIME NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    peso VARCHAR(20),
    presion VARCHAR(20),
    contexto_salud VARCHAR(500),
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_citas_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    CONSTRAINT fk_citas_medico FOREIGN KEY (medico_id) REFERENCES medicos(id),
    CONSTRAINT chk_citas_estado CHECK (estado IN ('PENDIENTE','CONFIRMADA','CANCELADA','ATENDIDA'))
);

CREATE INDEX idx_citas_medico_fecha ON citas(medico_id, fecha_hora);
CREATE INDEX idx_citas_paciente ON citas(paciente_id);

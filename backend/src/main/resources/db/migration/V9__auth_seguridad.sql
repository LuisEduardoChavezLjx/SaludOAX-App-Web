ALTER TABLE usuarios
    ADD COLUMN password_changed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER password_hash;

CREATE TABLE token_blacklist (
                                 id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                 usuario_id BIGINT NOT NULL,
                                 token_jti CHAR(36) NOT NULL UNIQUE,
                                 fecha_expiracion DATETIME NOT NULL,
                                 invalidado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                 CONSTRAINT fk_blacklist_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE INDEX idx_blacklist_expiracion ON token_blacklist(fecha_expiracion);

CREATE TABLE password_reset_token (
                                      id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                      usuario_id BIGINT NOT NULL,
                                      token_hash CHAR(64) NOT NULL UNIQUE,
                                      expira_en DATETIME NOT NULL,
                                      usado BOOLEAN NOT NULL DEFAULT FALSE,
                                      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                      CONSTRAINT fk_reset_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE INDEX idx_reset_expira ON password_reset_token(expira_en);

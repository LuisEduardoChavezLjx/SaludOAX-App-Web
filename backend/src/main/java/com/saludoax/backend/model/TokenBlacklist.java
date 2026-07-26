package com.saludoax.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "token_blacklist")
public class TokenBlacklist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "token_jti", nullable = false, unique = true, length = 36)
    private String tokenJti;

    @Column(name = "fecha_expiracion", nullable = false)
    private LocalDateTime fechaExpiracion;

    @Column(name = "invalidado_en", nullable = false, updatable = false)
    private LocalDateTime invalidadoEn = LocalDateTime.now();

    public TokenBlacklist() {}

    public TokenBlacklist(Long usuarioId, String tokenJti, LocalDateTime fechaExpiracion) {
        this.usuarioId = usuarioId;
        this.tokenJti = tokenJti;
        this.fechaExpiracion = fechaExpiracion;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public String getTokenJti() { return tokenJti; }
    public void setTokenJti(String tokenJti) { this.tokenJti = tokenJti; }

    public LocalDateTime getFechaExpiracion() { return fechaExpiracion; }
    public void setFechaExpiracion(LocalDateTime fechaExpiracion) { this.fechaExpiracion = fechaExpiracion; }

    public LocalDateTime getInvalidadoEn() { return invalidadoEn; }
    public void setInvalidadoEn(LocalDateTime invalidadoEn) { this.invalidadoEn = invalidadoEn; }
}

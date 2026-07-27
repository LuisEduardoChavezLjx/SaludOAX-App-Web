package com.saludoax.backend.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.time.LocalDateTime;
import java.util.Collection;

public class SaludoaxUserDetails extends User {

    private final Long usuarioId;
    private final LocalDateTime passwordChangedAt;

    public SaludoaxUserDetails(String username,
                               String password,
                               Collection<? extends GrantedAuthority> authorities,
                               Long usuarioId,
                               LocalDateTime passwordChangedAt) {
        super(username, password, authorities);
        this.usuarioId = usuarioId;
        this.passwordChangedAt = passwordChangedAt;
    }

    public Long getUsuarioId() { return usuarioId; }
    public LocalDateTime getPasswordChangedAt() { return passwordChangedAt; }
}

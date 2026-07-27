package com.saludoax.backend.dto;

public class UsuarioAdminDTO {
    private Long id;
    private String email;
    private String nombre;
    private String rol;
    private Boolean activo;

    public UsuarioAdminDTO(Long id, String email, String nombre, String rol, Boolean activo) {
        this.id = id;
        this.email = email;
        this.nombre = nombre;
        this.rol = rol;
        this.activo = activo;
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getNombre() { return nombre; }
    public String getRol() { return rol; }
    public Boolean getActivo() { return activo; }
}

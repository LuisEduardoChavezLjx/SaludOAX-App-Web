package com.saludoax.backend.dto;

public class EspecialidadSimpleDTO {
    private Long id;
    private String nombre;

    public EspecialidadSimpleDTO(Long id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
}

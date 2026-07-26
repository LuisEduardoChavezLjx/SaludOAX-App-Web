package com.saludoax.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PacienteDTO {

    // Se usa en las respuestas; nulo cuando se manda como request de creacion
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 150, message = "El nombre no puede superar 150 caracteres")
    private String nombre;

    @Size(max = 20, message = "El telefono no puede superar 20 caracteres")
    private String telefono;

    @Size(max = 20, message = "El peso no puede superar 20 caracteres")
    private String peso;

    @Size(max = 20, message = "La presion no puede superar 20 caracteres")
    private String presion;

    @Size(max = 500, message = "El contexto de salud no puede superar 500 caracteres")
    private String contextoSalud;

    public PacienteDTO() {}

    public PacienteDTO(Long id, String nombre, String telefono, String peso, String presion, String contextoSalud) {
        this.id = id;
        this.nombre = nombre;
        this.telefono = telefono;
        this.peso = peso;
        this.presion = presion;
        this.contextoSalud = contextoSalud;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getPeso() { return peso; }
    public void setPeso(String peso) { this.peso = peso; }

    public String getPresion() { return presion; }
    public void setPresion(String presion) { this.presion = presion; }

    public String getContextoSalud() { return contextoSalud; }
    public void setContextoSalud(String contextoSalud) { this.contextoSalud = contextoSalud; }
}

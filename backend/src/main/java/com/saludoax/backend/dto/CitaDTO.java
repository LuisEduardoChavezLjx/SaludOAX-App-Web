package com.saludoax.backend.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class CitaDTO {

    private Long id;

    @NotNull(message = "El paciente es obligatorio")
    private Long pacienteId;

    private String pacienteNombre;

    @NotNull(message = "El medico es obligatorio")
    private Long medicoId;

    @NotNull(message = "La fecha y hora son obligatorias")
    @Future(message = "La fecha de la cita debe ser futura")
    private LocalDateTime fechaHora;

    private String estado;

    private String peso;
    private String presion;
    private String contextoSalud;

    public CitaDTO() {}

    public CitaDTO(Long id, Long pacienteId, String pacienteNombre, Long medicoId,
                    LocalDateTime fechaHora, String estado, String peso, String presion, String contextoSalud) {
        this.id = id;
        this.pacienteId = pacienteId;
        this.pacienteNombre = pacienteNombre;
        this.medicoId = medicoId;
        this.fechaHora = fechaHora;
        this.estado = estado;
        this.peso = peso;
        this.presion = presion;
        this.contextoSalud = contextoSalud;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPacienteId() { return pacienteId; }
    public void setPacienteId(Long pacienteId) { this.pacienteId = pacienteId; }

    public String getPacienteNombre() { return pacienteNombre; }
    public void setPacienteNombre(String pacienteNombre) { this.pacienteNombre = pacienteNombre; }

    public Long getMedicoId() { return medicoId; }
    public void setMedicoId(Long medicoId) { this.medicoId = medicoId; }

    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getPeso() { return peso; }
    public void setPeso(String peso) { this.peso = peso; }

    public String getPresion() { return presion; }
    public void setPresion(String presion) { this.presion = presion; }

    public String getContextoSalud() { return contextoSalud; }
    public void setContextoSalud(String contextoSalud) { this.contextoSalud = contextoSalud; }
}

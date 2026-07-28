package com.saludoax.backend.dto;

import com.saludoax.backend.dto.validacion.PesoValido;
import com.saludoax.backend.dto.validacion.PresionDiastolicaValida;
import com.saludoax.backend.dto.validacion.PresionSistolicaValida;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CitaDTO {

    private Long id;

    private Long pacienteId;

    private String pacienteNombre;

    @NotNull(message = "El medico es obligatorio")
    private Long medicoId;

    @NotNull(message = "La fecha y hora son obligatorias")
    @Future(message = "La fecha de la cita debe ser futura")
    private LocalDateTime fechaHora;

    private String estado;

    @PesoValido
    private BigDecimal pesoKg;

    @PresionSistolicaValida
    private Integer presionSistolica;

    @PresionDiastolicaValida
    private Integer presionDiastolica;

    private String contextoSalud;

    public CitaDTO() {}

    public CitaDTO(Long id, Long pacienteId, String pacienteNombre, Long medicoId,
                   LocalDateTime fechaHora, String estado, BigDecimal pesoKg,
                   Integer presionSistolica, Integer presionDiastolica, String contextoSalud) {
        this.id = id;
        this.pacienteId = pacienteId;
        this.pacienteNombre = pacienteNombre;
        this.medicoId = medicoId;
        this.fechaHora = fechaHora;
        this.estado = estado;
        this.pesoKg = pesoKg;
        this.presionSistolica = presionSistolica;
        this.presionDiastolica = presionDiastolica;
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

    public BigDecimal getPesoKg() { return pesoKg; }
    public void setPesoKg(BigDecimal pesoKg) { this.pesoKg = pesoKg; }

    public Integer getPresionSistolica() { return presionSistolica; }
    public void setPresionSistolica(Integer presionSistolica) { this.presionSistolica = presionSistolica; }

    public Integer getPresionDiastolica() { return presionDiastolica; }
    public void setPresionDiastolica(Integer presionDiastolica) { this.presionDiastolica = presionDiastolica; }

    public String getContextoSalud() { return contextoSalud; }
    public void setContextoSalud(String contextoSalud) { this.contextoSalud = contextoSalud; }
}

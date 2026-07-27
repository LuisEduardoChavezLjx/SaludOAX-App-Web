package com.saludoax.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class UltimosVitalesDTO {

    private BigDecimal pesoKg;
    private Integer presionSistolica;
    private Integer presionDiastolica;
    private String contextoSalud;
    private LocalDateTime fechaCita;
    private String medicoNombre;

    public UltimosVitalesDTO() {}

    public UltimosVitalesDTO(BigDecimal pesoKg, Integer presionSistolica, Integer presionDiastolica,
                             String contextoSalud, LocalDateTime fechaCita, String medicoNombre) {
        this.pesoKg = pesoKg;
        this.presionSistolica = presionSistolica;
        this.presionDiastolica = presionDiastolica;
        this.contextoSalud = contextoSalud;
        this.fechaCita = fechaCita;
        this.medicoNombre = medicoNombre;
    }

    public BigDecimal getPesoKg() { return pesoKg; }
    public Integer getPresionSistolica() { return presionSistolica; }
    public Integer getPresionDiastolica() { return presionDiastolica; }
    public String getContextoSalud() { return contextoSalud; }
    public LocalDateTime getFechaCita() { return fechaCita; }
    public String getMedicoNombre() { return medicoNombre; }
}

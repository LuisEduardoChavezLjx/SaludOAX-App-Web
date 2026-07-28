package com.saludoax.backend.dto;

import java.time.LocalDateTime;

public class EstimacionDTO {

    private Long id;
    private Long citaId;
    private String gravedad;
    private Integer tiempoEstimadoMin;
    private LocalDateTime creadoEn;

    public EstimacionDTO() {}

    public EstimacionDTO(Long id, Long citaId, String gravedad, Integer tiempoEstimadoMin, LocalDateTime creadoEn) {
        this.id = id;
        this.citaId = citaId;
        this.gravedad = gravedad;
        this.tiempoEstimadoMin = tiempoEstimadoMin;
        this.creadoEn = creadoEn;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCitaId() { return citaId; }
    public void setCitaId(Long citaId) { this.citaId = citaId; }

    public String getGravedad() { return gravedad; }
    public void setGravedad(String gravedad) { this.gravedad = gravedad; }

    public Integer getTiempoEstimadoMin() { return tiempoEstimadoMin; }
    public void setTiempoEstimadoMin(Integer tiempoEstimadoMin) { this.tiempoEstimadoMin = tiempoEstimadoMin; }

    public LocalDateTime getCreadoEn() { return creadoEn; }
    public void setCreadoEn(LocalDateTime creadoEn) { this.creadoEn = creadoEn; }
}

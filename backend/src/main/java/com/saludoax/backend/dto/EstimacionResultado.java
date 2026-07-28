package com.saludoax.backend.dto;

import com.saludoax.backend.model.Gravedad;

public class EstimacionResultado {

    private final Gravedad gravedad;
    private final Integer tiempoEstimadoMin;

    public EstimacionResultado(Gravedad gravedad, Integer tiempoEstimadoMin) {
        this.gravedad = gravedad;
        this.tiempoEstimadoMin = tiempoEstimadoMin;
    }

    public Gravedad getGravedad() { return gravedad; }
    public Integer getTiempoEstimadoMin() { return tiempoEstimadoMin; }
}

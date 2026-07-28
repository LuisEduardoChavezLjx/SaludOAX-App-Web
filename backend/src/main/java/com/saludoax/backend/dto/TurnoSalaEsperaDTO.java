package com.saludoax.backend.dto;

import java.time.LocalDateTime;

public class TurnoSalaEsperaDTO {

    private Long citaId;
    private String pacienteNombre;
    private int posicion;
    private String estado;
    private String gravedad;
    private int minutosEsperaEstimados;
    private LocalDateTime horaLlegada;

    public TurnoSalaEsperaDTO(Long citaId, String pacienteNombre, int posicion, String estado,
                               String gravedad, int minutosEsperaEstimados, LocalDateTime horaLlegada) {
        this.citaId = citaId;
        this.pacienteNombre = pacienteNombre;
        this.posicion = posicion;
        this.estado = estado;
        this.gravedad = gravedad;
        this.minutosEsperaEstimados = minutosEsperaEstimados;
        this.horaLlegada = horaLlegada;
    }

    public Long getCitaId() { return citaId; }
    public String getPacienteNombre() { return pacienteNombre; }
    public int getPosicion() { return posicion; }
    public String getEstado() { return estado; }
    public String getGravedad() { return gravedad; }
    public int getMinutosEsperaEstimados() { return minutosEsperaEstimados; }
    public LocalDateTime getHoraLlegada() { return horaLlegada; }
}

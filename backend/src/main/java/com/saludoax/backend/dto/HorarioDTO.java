package com.saludoax.backend.dto;

public class HorarioDTO {
    private String diaSemana;
    private String horaInicio;
    private String horaFin;

    public HorarioDTO(String diaSemana, String horaInicio, String horaFin) {
        this.diaSemana = diaSemana;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
    }

    public String getDiaSemana() { return diaSemana; }
    public String getHoraInicio() { return horaInicio; }
    public String getHoraFin() { return horaFin; }
}

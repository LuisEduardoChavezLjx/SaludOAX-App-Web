package com.saludoax.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class HorarioInputDTO {

    @NotBlank
    private String diaSemana;

    @NotBlank
    private String horaInicio;

    @NotBlank
    private String horaFin;

    public @NotBlank String getDiaSemana() { return diaSemana; }
    public void setDiaSemana(@NotBlank String diaSemana) { this.diaSemana = diaSemana; }

    public @NotBlank String getHoraInicio() { return horaInicio; }
    public void setHoraInicio(@NotBlank String horaInicio) { this.horaInicio = horaInicio; }

    public @NotBlank String getHoraFin() { return horaFin; }
    public void setHoraFin(@NotBlank String horaFin) { this.horaFin = horaFin; }
}

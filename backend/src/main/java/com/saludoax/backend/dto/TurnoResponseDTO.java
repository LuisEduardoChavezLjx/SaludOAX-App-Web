package com.saludoax.backend.dto;

public class TurnoResponseDTO {

    private int posicion;
    private int minutosEsperaEstimados;
    private String medicoNombre;
    private String especialidad;
    private String horaCita;
    private String consultorio;
    private String gravedad;

    public TurnoResponseDTO() {}

    public TurnoResponseDTO(int posicion, int minutosEsperaEstimados, String medicoNombre,
                            String especialidad, String horaCita, String consultorio, String gravedad) {
        this.posicion = posicion;
        this.minutosEsperaEstimados = minutosEsperaEstimados;
        this.medicoNombre = medicoNombre;
        this.especialidad = especialidad;
        this.horaCita = horaCita;
        this.consultorio = consultorio;
        this.gravedad = gravedad;
    }

    public int getPosicion() { return posicion; }
    public int getMinutosEsperaEstimados() { return minutosEsperaEstimados; }
    public String getMedicoNombre() { return medicoNombre; }
    public String getEspecialidad() { return especialidad; }
    public String getHoraCita() { return horaCita; }
    public String getConsultorio() { return consultorio; }
    public String getGravedad() { return gravedad; }
}

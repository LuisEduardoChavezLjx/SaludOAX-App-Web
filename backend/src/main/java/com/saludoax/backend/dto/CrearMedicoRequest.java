package com.saludoax.backend.dto;

import jakarta.validation.constraints.*;
import java.util.List;

public class CrearMedicoRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El email es obligatorio")
    @Email
    private String email;

    private String password;

    @NotBlank(message = "La cédula es obligatoria")
    private String cedula;

    @NotBlank(message = "El consultorio es obligatorio")
    private String consultorio;

    private List<Long> especialidades;
    private List<HorarioInputDTO> horarios;

    public @NotBlank String getNombre() { return nombre; }
    public void setNombre(@NotBlank String nombre) { this.nombre = nombre; }

    public @NotBlank @Email String getEmail() { return email; }
    public void setEmail(@NotBlank @Email String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public @NotBlank String getCedula() { return cedula; }
    public void setCedula(@NotBlank String cedula) { this.cedula = cedula; }

    public @NotBlank String getConsultorio() { return consultorio; }
    public void setConsultorio(@NotBlank String consultorio) { this.consultorio = consultorio; }

    public List<Long> getEspecialidades() { return especialidades; }
    public void setEspecialidades(List<Long> especialidades) { this.especialidades = especialidades; }

    public List<HorarioInputDTO> getHorarios() { return horarios; }
    public void setHorarios(List<HorarioInputDTO> horarios) { this.horarios = horarios; }
}

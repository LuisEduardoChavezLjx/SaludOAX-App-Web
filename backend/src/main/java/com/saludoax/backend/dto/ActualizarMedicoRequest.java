package com.saludoax.backend.dto;

import jakarta.validation.constraints.*;
import java.util.List;

public class ActualizarMedicoRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El email es obligatorio")
    @Email
    private String email;

    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$",
             message = "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial")
    private String password;

    @NotBlank(message = "La cédula es obligatoria")
    private String cedula;

    @NotBlank(message = "El consultorio es obligatorio")
    private String consultorio;

    private List<Long> especialidades;
    private List<HorarioInputDTO> horarios;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }

    public void setPassword(String password) {
        this.password = password == null || password.isBlank() ? null : password;
    }

    public String getCedula() { return cedula; }
    public void setCedula(String cedula) { this.cedula = cedula; }

    public String getConsultorio() { return consultorio; }
    public void setConsultorio(String consultorio) { this.consultorio = consultorio; }

    public List<Long> getEspecialidades() { return especialidades; }
    public void setEspecialidades(List<Long> especialidades) { this.especialidades = especialidades; }

    public List<HorarioInputDTO> getHorarios() { return horarios; }
    public void setHorarios(List<HorarioInputDTO> horarios) { this.horarios = horarios; }
}

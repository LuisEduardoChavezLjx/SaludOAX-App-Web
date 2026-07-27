package com.saludoax.backend.dto;

import jakarta.validation.constraints.*;

public class CrearUsuarioRequest {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 150)
    private String nombre;

    @NotBlank(message = "El email es obligatorio")
    @Email
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$",
             message = "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial")
    private String password;

    @NotBlank(message = "El rol es obligatorio")
    private String rol;

    private String cedula;
    private String consultorio;

    public @NotBlank @Size(max = 150) String getNombre() { return nombre; }
    public void setNombre(@NotBlank @Size(max = 150) String nombre) { this.nombre = nombre; }

    public @NotBlank @Email String getEmail() { return email; }
    public void setEmail(@NotBlank @Email String email) { this.email = email; }

    public @NotBlank String getPassword() { return password; }
    public void setPassword(@NotBlank String password) { this.password = password; }

    public @NotBlank String getRol() { return rol; }
    public void setRol(@NotBlank String rol) { this.rol = rol; }

    public String getCedula() { return cedula; }
    public void setCedula(String cedula) { this.cedula = cedula; }

    public String getConsultorio() { return consultorio; }
    public void setConsultorio(String consultorio) { this.consultorio = consultorio; }
}

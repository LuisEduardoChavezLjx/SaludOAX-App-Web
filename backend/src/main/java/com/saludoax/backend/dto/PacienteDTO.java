package com.saludoax.backend.dto;

import com.saludoax.backend.dto.validacion.PesoValido;
import com.saludoax.backend.dto.validacion.PresionDiastolicaValida;
import com.saludoax.backend.dto.validacion.PresionSistolicaValida;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PacienteDTO {

    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 150, message = "El nombre no puede superar 150 caracteres")
    private String nombre;

    @Size(max = 20, message = "El telefono no puede superar 20 caracteres")
    private String telefono;

    @PesoValido
    private BigDecimal pesoKg;

    @PresionSistolicaValida
    private Integer presionSistolica;

    @PresionDiastolicaValida
    private Integer presionDiastolica;

    @Past(message = "La fecha de nacimiento debe ser anterior a hoy")
    private LocalDate fechaNacimiento;

    @Pattern(regexp = "MASCULINO|FEMENINO|OTRO", message = "El sexo debe ser MASCULINO, FEMENINO u OTRO")
    private String sexo;

    @Size(max = 500, message = "El contexto de salud no puede superar 500 caracteres")
    private String contextoSalud;

    public PacienteDTO() {}

    public PacienteDTO(Long id, String nombre, String telefono, BigDecimal pesoKg,
                       Integer presionSistolica, Integer presionDiastolica,
                       LocalDate fechaNacimiento, String sexo, String contextoSalud) {
        this.id = id;
        this.nombre = nombre;
        this.telefono = telefono;
        this.pesoKg = pesoKg;
        this.presionSistolica = presionSistolica;
        this.presionDiastolica = presionDiastolica;
        this.fechaNacimiento = fechaNacimiento;
        this.sexo = sexo;
        this.contextoSalud = contextoSalud;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public BigDecimal getPesoKg() { return pesoKg; }
    public void setPesoKg(BigDecimal pesoKg) { this.pesoKg = pesoKg; }

    public Integer getPresionSistolica() { return presionSistolica; }
    public void setPresionSistolica(Integer presionSistolica) { this.presionSistolica = presionSistolica; }

    public Integer getPresionDiastolica() { return presionDiastolica; }
    public void setPresionDiastolica(Integer presionDiastolica) { this.presionDiastolica = presionDiastolica; }

    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }

    public String getSexo() { return sexo; }
    public void setSexo(String sexo) { this.sexo = sexo; }

    public String getContextoSalud() { return contextoSalud; }
    public void setContextoSalud(String contextoSalud) { this.contextoSalud = contextoSalud; }
}

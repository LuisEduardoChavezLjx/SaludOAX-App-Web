package com.saludoax.backend.dto;

import java.util.List;

public class MedicoDTO {

    private Long id;
    private String nombre;
    private String especialidad;
    private String consultorio;
    private Boolean disponible;
    private List<EspecialidadSimpleDTO> especialidades;

    public MedicoDTO(Long id, String nombre, String especialidad, String consultorio,
                      Boolean disponible, List<EspecialidadSimpleDTO> especialidades) {
        this.id = id;
        this.nombre = nombre;
        this.especialidad = especialidad;
        this.consultorio = consultorio;
        this.disponible = disponible;
        this.especialidades = especialidades;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getEspecialidad() { return especialidad; }
    public String getConsultorio() { return consultorio; }
    public Boolean getDisponible() { return disponible; }
    public List<EspecialidadSimpleDTO> getEspecialidades() { return especialidades; }
}

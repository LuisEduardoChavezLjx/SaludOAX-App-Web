package com.saludoax.backend.dto;

import java.util.List;

public class MedicoAdminDTO {
    private Long id;
    private String nombre;
    private String email;
    private String cedula;
    private String consultorio;
    private String especialidad;
    private List<EspecialidadSimpleDTO> especialidadesAdicionales;
    private List<HorarioDTO> horarios;
    private Boolean activo;

    public MedicoAdminDTO(Long id, String nombre, String email, String cedula, String consultorio,
                          String especialidad, List<EspecialidadSimpleDTO> especialidadesAdicionales,
                          List<HorarioDTO> horarios, Boolean activo) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.cedula = cedula;
        this.consultorio = consultorio;
        this.especialidad = especialidad;
        this.especialidadesAdicionales = especialidadesAdicionales;
        this.horarios = horarios;
        this.activo = activo;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
    public String getCedula() { return cedula; }
    public String getConsultorio() { return consultorio; }
    public String getEspecialidad() { return especialidad; }
    public List<EspecialidadSimpleDTO> getEspecialidadesAdicionales() { return especialidadesAdicionales; }
    public List<HorarioDTO> getHorarios() { return horarios; }
    public Boolean getActivo() { return activo; }
}

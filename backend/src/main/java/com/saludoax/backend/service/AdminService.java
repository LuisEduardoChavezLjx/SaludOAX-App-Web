package com.saludoax.backend.service;

import com.saludoax.backend.dto.*;
import com.saludoax.backend.model.*;
import com.saludoax.backend.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;

@Service
public class AdminService {

    private final UsuarioRepository usuarioRepository;
    private final MedicoRepository medicoRepository;
    private final PacienteRepository pacienteRepository;
    private final RolRepository rolRepository;
    private final EspecialidadRepository especialidadRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(UsuarioRepository usuarioRepository, MedicoRepository medicoRepository,
                        PacienteRepository pacienteRepository, RolRepository rolRepository,
                        EspecialidadRepository especialidadRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.medicoRepository = medicoRepository;
        this.pacienteRepository = pacienteRepository;
        this.rolRepository = rolRepository;
        this.especialidadRepository = especialidadRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public Page<UsuarioAdminDTO> listarUsuarios(String busqueda, String rol, Boolean activo, Pageable pageable) {
        return usuarioRepository.buscarUsuarios(busqueda, rol, activo, pageable)
                .map(u -> new UsuarioAdminDTO(u.getId(), u.getEmail(), u.getNombre(),
                        u.getRol().getNombre(), u.getActivo()));
    }

    @Transactional
    public UsuarioAdminDTO crearUsuario(CrearUsuarioRequest request) {
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese email");
        }

        Rol rol = rolRepository.findByNombre(request.getRol())
                .orElseThrow(() -> new IllegalArgumentException("Rol inválido: " + request.getRol()));

        Usuario usuario = new Usuario();
        usuario.setEmail(request.getEmail());
        usuario.setNombre(request.getNombre());
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(rol);
        usuarioRepository.save(usuario);

        switch (request.getRol()) {
            case "MEDICO" -> {
                Medico medico = new Medico();
                medico.setUsuario(usuario);
                medico.setNombre(request.getNombre());
                medico.setEspecialidad("Medicina General");
                medico.setCedula(request.getCedula());
                medico.setConsultorio(request.getConsultorio());
                medicoRepository.save(medico);
            }
            case "PACIENTE" -> {
                Paciente paciente = new Paciente();
                paciente.setUsuario(usuario);
                paciente.setNombre(request.getNombre());
                pacienteRepository.save(paciente);
            }
        }

        return new UsuarioAdminDTO(usuario.getId(), usuario.getEmail(), usuario.getNombre(),
                rol.getNombre(), usuario.getActivo());
    }

    @Transactional
    public UsuarioAdminDTO actualizarUsuario(Long id, CrearUsuarioRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        // Verificar email único si cambia
        if (request.getEmail() != null && !request.getEmail().equals(usuario.getEmail())) {
            if (usuarioRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Ya existe un usuario con ese email");
            }
            usuario.setEmail(request.getEmail());
        }

        if (request.getNombre() != null) {
            usuario.setNombre(request.getNombre());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getRol() != null) {
            Rol rol = rolRepository.findByNombre(request.getRol())
                    .orElseThrow(() -> new IllegalArgumentException("Rol inválido: " + request.getRol()));
            usuario.setRol(rol);
        }

        usuarioRepository.save(usuario);

        if (request.getRol() != null) {
            // Al cambiar rol, actualizar o crear el perfil correspondiente
            switch (request.getRol()) {
                case "MEDICO" -> {
                    if (!medicoRepository.existsById(usuario.getId())) {
                        Medico medico = new Medico();
                        medico.setUsuario(usuario);
                        medico.setNombre(usuario.getNombre());
                        medico.setEspecialidad("Medicina General");
                        medico.setCedula(request.getCedula());
                        medico.setConsultorio(request.getConsultorio());
                        medicoRepository.save(medico);
                    }
                }
                case "PACIENTE" -> {
                    if (!pacienteRepository.existsById(usuario.getId())) {
                        Paciente paciente = new Paciente();
                        paciente.setUsuario(usuario);
                        paciente.setNombre(usuario.getNombre());
                        pacienteRepository.save(paciente);
                    }
                }
            }
        }

        return new UsuarioAdminDTO(usuario.getId(), usuario.getEmail(), usuario.getNombre(),
                usuario.getRol().getNombre(), usuario.getActivo());
    }

    @Transactional
    public void desactivarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void reactivarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        usuario.setActivo(true);
        usuarioRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public Page<MedicoAdminDTO> listarMedicos(String busqueda, Long especialidadId, Pageable pageable) {
        return medicoRepository.buscarMedicos(busqueda, especialidadId, pageable)
                .map(this::toMedicoAdminDTO);
    }

    @Transactional
    public MedicoAdminDTO crearMedico(CrearMedicoRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese email");
        }

        Rol rolMedico = rolRepository.findByNombre("MEDICO")
                .orElseThrow(() -> new IllegalStateException("El rol MEDICO no existe"));

        Usuario usuario = new Usuario();
        usuario.setEmail(request.getEmail());
        usuario.setNombre(request.getNombre());
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(rolMedico);
        usuarioRepository.save(usuario);

        Medico medico = new Medico();
        medico.setUsuario(usuario);
        medico.setNombre(request.getNombre());
        medico.setCedula(request.getCedula());
        medico.setConsultorio(request.getConsultorio());
        medico.setEspecialidad("Medicina General");

        if (request.getEspecialidades() != null) {
            List<Especialidad> especialidades = especialidadRepository.findAllById(request.getEspecialidades());
            medico.getEspecialidades().addAll(especialidades);
            if (!especialidades.isEmpty()) {
                medico.setEspecialidad(especialidades.get(0).getNombre());
            }
        }

        if (request.getHorarios() != null) {
            request.getHorarios().forEach(h -> {
                HorarioMedico hm = new HorarioMedico();
                hm.setMedico(medico);
                hm.setDiaSemana(h.getDiaSemana());
                hm.setHoraInicio(LocalTime.parse(h.getHoraInicio()));
                hm.setHoraFin(LocalTime.parse(h.getHoraFin()));
                medico.getHorarios().add(hm);
            });
        }

        medicoRepository.save(medico);
        return toMedicoAdminDTO(medico);
    }

    @Transactional
    public MedicoAdminDTO actualizarMedico(Long id, CrearMedicoRequest request) {
        Medico medico = medicoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Médico no encontrado"));

        Usuario usuario = medico.getUsuario();

        if (request.getNombre() != null) {
            medico.setNombre(request.getNombre());
            usuario.setNombre(request.getNombre());
        }
        if (request.getCedula() != null) medico.setCedula(request.getCedula());
        if (request.getConsultorio() != null) medico.setConsultorio(request.getConsultorio());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getEspecialidades() != null) {
            List<Especialidad> especialidades = especialidadRepository.findAllById(request.getEspecialidades());
            medico.getEspecialidades().clear();
            medico.getEspecialidades().addAll(especialidades);
            if (!especialidades.isEmpty()) {
                medico.setEspecialidad(especialidades.get(0).getNombre());
            }
        }

        if (request.getHorarios() != null) {
            medico.getHorarios().clear();
            request.getHorarios().forEach(h -> {
                HorarioMedico hm = new HorarioMedico();
                hm.setMedico(medico);
                hm.setDiaSemana(h.getDiaSemana());
                hm.setHoraInicio(LocalTime.parse(h.getHoraInicio()));
                hm.setHoraFin(LocalTime.parse(h.getHoraFin()));
                medico.getHorarios().add(hm);
            });
        }

        usuarioRepository.save(usuario);
        medicoRepository.save(medico);
        return toMedicoAdminDTO(medico);
    }

    private MedicoAdminDTO toMedicoAdminDTO(Medico m) {
        List<EspecialidadSimpleDTO> adicionales = m.getEspecialidades().stream()
                .map(e -> new EspecialidadSimpleDTO(e.getId(), e.getNombre()))
                .toList();

        List<HorarioDTO> horarios = m.getHorarios().stream()
                .map(h -> new HorarioDTO(h.getDiaSemana(),
                        h.getHoraInicio().toString(),
                        h.getHoraFin().toString()))
                .toList();

        return new MedicoAdminDTO(m.getId(), m.getNombre(), m.getUsuario().getEmail(),
                m.getCedula(), m.getConsultorio(), m.getEspecialidad(),
                adicionales, horarios, m.getUsuario().getActivo());
    }
}

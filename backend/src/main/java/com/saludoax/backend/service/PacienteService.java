package com.saludoax.backend.service;

import com.saludoax.backend.dto.PacienteDTO;
import com.saludoax.backend.dto.TurnoResponseDTO;
import com.saludoax.backend.dto.TurnoSalaEsperaDTO;
import com.saludoax.backend.dto.UltimosVitalesDTO;
import com.saludoax.backend.model.Cita;
import com.saludoax.backend.model.EstadoCita;
import com.saludoax.backend.model.Paciente;
import com.saludoax.backend.model.Usuario;
import com.saludoax.backend.repository.CitaRepository;
import com.saludoax.backend.repository.PacienteRepository;
import com.saludoax.backend.repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
public class PacienteService {

    private final PacienteRepository pacienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final CitaRepository citaRepository;
    private final SalaEsperaService salaEsperaService;

    public PacienteService(PacienteRepository pacienteRepository, UsuarioRepository usuarioRepository,
                           CitaRepository citaRepository, SalaEsperaService salaEsperaService) {
        this.pacienteRepository = pacienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.citaRepository = citaRepository;
        this.salaEsperaService = salaEsperaService;
    }

    public Page<PacienteDTO> listar(String nombre, Pageable pageable) {
        Page<Paciente> page = (nombre == null || nombre.isBlank())
                ? pacienteRepository.findAll(pageable)
                : pacienteRepository.findByNombreContainingIgnoreCase(nombre, pageable);
        return page.map(this::toDTO);
    }

    public PacienteDTO obtener(Long id) {
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado"));
        return toDTO(paciente);
    }

    @Transactional
    public PacienteDTO crear(String emailUsuarioAutenticado, PacienteDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuarioAutenticado)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        if (pacienteRepository.findByUsuarioId(usuario.getId()).isPresent()) {
            throw new IllegalArgumentException("Este usuario ya tiene un perfil de paciente");
        }

        Paciente paciente = new Paciente();
        paciente.setUsuario(usuario);
        aplicarCambios(paciente, dto);

        pacienteRepository.save(paciente);
        usuarioRepository.save(usuario);
        return toDTO(paciente);
    }

    @Transactional
    public PacienteDTO actualizar(Long id, PacienteDTO dto) {
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado"));

        aplicarCambios(paciente, dto);
        pacienteRepository.save(paciente);
        usuarioRepository.save(paciente.getUsuario());
        return toDTO(paciente);
    }

    public void eliminar(Long id) {
        if (!pacienteRepository.existsById(id)) {
            throw new IllegalArgumentException("Paciente no encontrado");
        }
        pacienteRepository.deleteById(id);
    }

    private void aplicarCambios(Paciente paciente, PacienteDTO dto) {
        paciente.setNombre(dto.getNombre());
        paciente.getUsuario().setNombre(dto.getNombre());
        paciente.setTelefono(dto.getTelefono());
        paciente.setPesoKg(dto.getPesoKg());
        paciente.setPresionSistolica(dto.getPresionSistolica());
        paciente.setPresionDiastolica(dto.getPresionDiastolica());
        paciente.setFechaNacimiento(dto.getFechaNacimiento());
        paciente.setSexo(dto.getSexo());
        paciente.setContextoSalud(dto.getContextoSalud());
    }

    @Transactional(readOnly = true)
    public boolean esPropietario(Long pacienteId, String email) {
        return pacienteId != null && email != null
                && pacienteRepository.existsByIdAndUsuarioEmail(pacienteId, email);
    }

    public PacienteDTO buscarPorUsuarioId(Long usuarioId) {
        Paciente paciente = pacienteRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Perfil de paciente no encontrado"));
        return toDTO(paciente);
    }

    @Transactional(readOnly = true)
    public TurnoResponseDTO obtenerMiTurno(Long usuarioId) {
        Paciente paciente = pacienteRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Perfil de paciente no encontrado"));

        List<EstadoCita> activos = List.of(EstadoCita.PENDIENTE, EstadoCita.CONFIRMADA);
        Cita cita = citaRepository
                .findFirstByPacienteIdAndEstadoInOrderByFechaHoraAsc(paciente.getId(), activos)
                .orElseThrow(() -> new IllegalArgumentException("No tienes citas pendientes"));

        TurnoSalaEsperaDTO turno = salaEsperaService.obtenerTurnoDeCita(cita.getId());

        String horaFormateada = cita.getFechaHora()
                .format(DateTimeFormatter.ofPattern("h:mm a", new Locale("es", "MX")));

        return new TurnoResponseDTO(
                turno != null ? turno.getPosicion() : 0,
                turno != null ? turno.getMinutosEsperaEstimados() : 0,
                cita.getMedico().getNombre(),
                cita.getMedico().getEspecialidad(),
                horaFormateada,
                cita.getMedico().getConsultorio(),
                turno != null ? turno.getGravedad() : null
        );
    }

    @Transactional(readOnly = true)
    public UltimosVitalesDTO obtenerUltimosVitales(Long usuarioId) {
        Paciente paciente = pacienteRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Perfil de paciente no encontrado"));

        List<EstadoCita> atendidas = List.of(EstadoCita.ATENDIDA, EstadoCita.PENDIENTE, EstadoCita.CONFIRMADA);
        Cita ultimaCita = citaRepository
                .findFirstByPacienteIdAndEstadoInOrderByFechaHoraDesc(paciente.getId(), atendidas)
                .orElse(null);

        if (ultimaCita == null) {
            return new UltimosVitalesDTO(null, null, null, null, null, null);
        }

        return new UltimosVitalesDTO(
                ultimaCita.getPesoKg(),
                ultimaCita.getPresionSistolica(),
                ultimaCita.getPresionDiastolica(),
                ultimaCita.getContextoSalud(),
                ultimaCita.getFechaHora(),
                ultimaCita.getMedico().getNombre()
        );
    }

    private PacienteDTO toDTO(Paciente p) {
        return new PacienteDTO(p.getId(), p.getNombre(), p.getTelefono(), p.getPesoKg(),
                p.getPresionSistolica(), p.getPresionDiastolica(),
                p.getFechaNacimiento(), p.getSexo(), p.getContextoSalud());
    }
}

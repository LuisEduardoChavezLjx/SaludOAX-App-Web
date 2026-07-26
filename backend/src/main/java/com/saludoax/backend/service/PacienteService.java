package com.saludoax.backend.service;

import com.saludoax.backend.dto.PacienteDTO;
import com.saludoax.backend.model.Paciente;
import com.saludoax.backend.model.Usuario;
import com.saludoax.backend.repository.PacienteRepository;
import com.saludoax.backend.repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PacienteService {

    private final PacienteRepository pacienteRepository;
    private final UsuarioRepository usuarioRepository;

    public PacienteService(PacienteRepository pacienteRepository, UsuarioRepository usuarioRepository) {
        this.pacienteRepository = pacienteRepository;
        this.usuarioRepository = usuarioRepository;
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
        return toDTO(paciente);
    }

    public PacienteDTO actualizar(Long id, PacienteDTO dto) {
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado"));

        aplicarCambios(paciente, dto);
        pacienteRepository.save(paciente);
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
        paciente.setTelefono(dto.getTelefono());
        paciente.setPeso(dto.getPeso());
        paciente.setPresion(dto.getPresion());
        paciente.setContextoSalud(dto.getContextoSalud());
    }

    private PacienteDTO toDTO(Paciente p) {
        return new PacienteDTO(p.getId(), p.getNombre(), p.getTelefono(), p.getPeso(), p.getPresion(), p.getContextoSalud());
    }
}

package com.saludoax.backend.service;

import com.saludoax.backend.dto.CitaDTO;
import com.saludoax.backend.model.Cita;
import com.saludoax.backend.model.EstadoCita;
import com.saludoax.backend.model.Medico;
import com.saludoax.backend.model.Paciente;
import com.saludoax.backend.repository.CitaRepository;
import com.saludoax.backend.repository.MedicoRepository;
import com.saludoax.backend.repository.PacienteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CitaService {

    private final CitaRepository citaRepository;
    private final PacienteRepository pacienteRepository;
    private final MedicoRepository medicoRepository;

    public CitaService(CitaRepository citaRepository, PacienteRepository pacienteRepository, MedicoRepository medicoRepository) {
        this.citaRepository = citaRepository;
        this.pacienteRepository = pacienteRepository;
        this.medicoRepository = medicoRepository;
    }

    public Page<CitaDTO> listar(String estado, Pageable pageable) {
        Page<Cita> page = (estado == null || estado.isBlank())
                ? citaRepository.findAll(pageable)
                : citaRepository.findByEstado(EstadoCita.valueOf(estado.toUpperCase()), pageable);
        return page.map(this::toDTO);
    }

    public Page<CitaDTO> listarPorPaciente(Long pacienteId, Pageable pageable) {
        return citaRepository.findByPacienteId(pacienteId, pageable).map(this::toDTO);
    }

    public Page<CitaDTO> listarPorMedico(Long medicoId, Pageable pageable) {
        return citaRepository.findByMedicoId(medicoId, pageable).map(this::toDTO);
    }

    public CitaDTO obtener(Long id) {
        return toDTO(buscarOFallar(id));
    }

    @Transactional
    public CitaDTO crear(CitaDTO dto) {
        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado"));
        Medico medico = medicoRepository.findById(dto.getMedicoId())
                .orElseThrow(() -> new IllegalArgumentException("Medico no encontrado"));

        Cita cita = new Cita();
        cita.setPaciente(paciente);
        cita.setMedico(medico);
        cita.setFechaHora(dto.getFechaHora());
        cita.setPesoKg(dto.getPesoKg());
        cita.setPresionSistolica(dto.getPresionSistolica());
        cita.setPresionDiastolica(dto.getPresionDiastolica());
        cita.setContextoSalud(dto.getContextoSalud());
        cita.setEstado(EstadoCita.PENDIENTE);

        citaRepository.save(cita);
        return toDTO(cita);
    }

    @Transactional
    public CitaDTO cambiarEstado(Long id, String nuevoEstado) {
        Cita cita = buscarOFallar(id);
        cita.setEstado(EstadoCita.valueOf(nuevoEstado.toUpperCase()));
        citaRepository.save(cita);
        return toDTO(cita);
    }

    // Usado por el Flujo B: posicion en fila = numero de citas activas antes de esta.
    public int posicionEnFila(Long citaId) {
        Cita cita = buscarOFallar(citaId);
        List<Cita> anteriores = citaRepository.findCitasAntesEnFila(cita.getMedico().getId(), cita.getFechaHora());
        return anteriores.size();
    }

    private Cita buscarOFallar(Long id) {
        return citaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cita no encontrada"));
    }

    private CitaDTO toDTO(Cita c) {
        return new CitaDTO(
                c.getId(),
                c.getPaciente().getId(),
                c.getPaciente().getNombre(),
                c.getMedico().getId(),
                c.getFechaHora(),
                c.getEstado().name(),
                c.getPesoKg(),
                c.getPresionSistolica(),
                c.getPresionDiastolica(),
                c.getContextoSalud()
        );
    }
}

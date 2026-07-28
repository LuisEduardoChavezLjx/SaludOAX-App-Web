package com.saludoax.backend.service;

import com.saludoax.backend.dto.EspecialidadSimpleDTO;
import com.saludoax.backend.dto.MedicoDTO;
import com.saludoax.backend.model.Medico;
import com.saludoax.backend.repository.MedicoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class MedicoService {

    private final MedicoRepository medicoRepository;

    public MedicoService(MedicoRepository medicoRepository) {
        this.medicoRepository = medicoRepository;
    }

    public Page<MedicoDTO> listar(String busqueda, Long especialidadId, Pageable pageable) {
        return medicoRepository.buscarMedicos(busqueda, especialidadId, pageable).map(this::toDTO);
    }

    public MedicoDTO obtener(Long id) {
        return toDTO(buscarOFallar(id));
    }

    public MedicoDTO obtenerPorUsuarioId(Long usuarioId) {
        return medicoRepository.findByUsuarioId(usuarioId)
                .map(this::toDTO)
                .orElseThrow(() -> new IllegalArgumentException("Perfil de medico no encontrado"));
    }

    private Medico buscarOFallar(Long id) {
        return medicoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Medico no encontrado"));
    }

    private MedicoDTO toDTO(Medico m) {
        var especialidades = m.getEspecialidades().stream()
                .map(e -> new EspecialidadSimpleDTO(e.getId(), e.getNombre()))
                .toList();
        return new MedicoDTO(m.getId(), m.getNombre(), m.getEspecialidad(), m.getConsultorio(),
                m.getDisponible(), especialidades);
    }
}

package com.saludoax.backend.service;

import com.saludoax.backend.dto.EspecialidadSimpleDTO;
import com.saludoax.backend.repository.EspecialidadRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class EspecialidadService {

    private final EspecialidadRepository especialidadRepository;

    public EspecialidadService(EspecialidadRepository especialidadRepository) {
        this.especialidadRepository = especialidadRepository;
    }

    public List<EspecialidadSimpleDTO> listarTodas() {
        return especialidadRepository.findAll().stream()
                .map(e -> new EspecialidadSimpleDTO(e.getId(), e.getNombre()))
                .toList();
    }
}

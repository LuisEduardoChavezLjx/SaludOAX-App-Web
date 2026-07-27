package com.saludoax.backend.controller;

import com.saludoax.backend.dto.EspecialidadSimpleDTO;
import com.saludoax.backend.model.Especialidad;
import com.saludoax.backend.repository.EspecialidadRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class EspecialidadController {

    private final EspecialidadRepository especialidadRepository;

    public EspecialidadController(EspecialidadRepository especialidadRepository) {
        this.especialidadRepository = especialidadRepository;
    }

    @GetMapping("/especialidades")
    public ResponseEntity<List<EspecialidadSimpleDTO>> listarEspecialidades() {
        List<EspecialidadSimpleDTO> lista = especialidadRepository.findAll().stream()
                .map(e -> new EspecialidadSimpleDTO(e.getId(), e.getNombre()))
                .toList();
        return ResponseEntity.ok(lista);
    }
}

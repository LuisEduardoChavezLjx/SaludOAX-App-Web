package com.saludoax.backend.controller;

import com.saludoax.backend.dto.EspecialidadSimpleDTO;
import com.saludoax.backend.service.EspecialidadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class EspecialidadController {

    private final EspecialidadService especialidadService;

    public EspecialidadController(EspecialidadService especialidadService) {
        this.especialidadService = especialidadService;
    }

    @GetMapping("/especialidades")
    public ResponseEntity<List<EspecialidadSimpleDTO>> listarEspecialidades() {
        return ResponseEntity.ok(especialidadService.listarTodas());
    }
}

package com.saludoax.backend.controller;

import com.saludoax.backend.dto.CitaDTO;
import com.saludoax.backend.dto.EstimacionDTO;
import com.saludoax.backend.dto.PageResponse;
import com.saludoax.backend.service.CitaService;
import com.saludoax.backend.service.EstimacionService;
import com.saludoax.backend.service.SalaEsperaService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/citas")
public class CitaController {

    private final CitaService citaService;
    private final EstimacionService estimacionService;
    private final SalaEsperaService salaEsperaService;

    public CitaController(CitaService citaService, EstimacionService estimacionService, SalaEsperaService salaEsperaService) {
        this.citaService = citaService;
        this.estimacionService = estimacionService;
        this.salaEsperaService = salaEsperaService;
    }

    // GET /api/citas?page=0&size=10&estado=PENDIENTE
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MEDICO')")
    public ResponseEntity<PageResponse<CitaDTO>> listar(
            @RequestParam(required = false) String estado,
            Pageable pageable) {
        return ResponseEntity.ok(new PageResponse<>(citaService.listar(estado, pageable)));
    }

    @GetMapping("/paciente/{pacienteId}")
    @PreAuthorize("hasRole('ADMIN') or @pacienteService.esPropietario(#pacienteId, authentication.name)")
    public ResponseEntity<PageResponse<CitaDTO>> listarPorPaciente(
            @PathVariable Long pacienteId, Pageable pageable) {
        return ResponseEntity.ok(new PageResponse<>(citaService.listarPorPaciente(pacienteId, pageable)));
    }

    @GetMapping("/medico/{medicoId}")
    @PreAuthorize("hasRole('ADMIN') or @medicoService.esPropietario(#medicoId, authentication.name)")
    public ResponseEntity<PageResponse<CitaDTO>> listarPorMedico(
            @PathVariable Long medicoId, Pageable pageable) {
        return ResponseEntity.ok(new PageResponse<>(citaService.listarPorMedico(medicoId, pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @citaService.esParticipante(#id, authentication.name)")
    public ResponseEntity<CitaDTO> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(citaService.obtener(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or (hasRole('PACIENTE') and (#dto.pacienteId == null "
            + "or @pacienteService.esPropietario(#dto.pacienteId, authentication.name)))")
    public ResponseEntity<CitaDTO> crear(@Valid @RequestBody CitaDTO dto, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED).body(citaService.crear(dto, authentication.getName()));
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN') or @citaService.esParticipante(#id, authentication.name)")
    public ResponseEntity<CitaDTO> cambiarEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(citaService.cambiarEstado(id, body.get("estado")));
    }

    // Consumido por el Flujo B para mostrar tiempo estimado de espera
    @GetMapping("/{id}/posicion-fila")
    @PreAuthorize("hasRole('ADMIN') or @citaService.esParticipante(#id, authentication.name)")
    public ResponseEntity<Map<String, Integer>> posicionEnFila(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("posicion", citaService.posicionEnFila(id)));
    }

    @PostMapping("/{id}/estimar")
    @PreAuthorize("hasRole('ADMIN') or @citaService.esMedicoDeLaCita(#id, authentication.name)")
    public ResponseEntity<EstimacionDTO> estimar(@PathVariable Long id) {
        return ResponseEntity.ok(estimacionService.estimar(id));
    }

    @GetMapping("/{id}/estimacion")
    @PreAuthorize("hasRole('ADMIN') or @citaService.esParticipante(#id, authentication.name)")
    public ResponseEntity<EstimacionDTO> obtenerEstimacion(@PathVariable Long id) {
        return ResponseEntity.ok(estimacionService.obtenerPorCita(id));
    }

    @PostMapping("/{id}/turno/iniciar")
    @PreAuthorize("hasRole('ADMIN') or @citaService.esMedicoDeLaCita(#id, authentication.name)")
    public ResponseEntity<Void> iniciarTurno(@PathVariable Long id) {
        salaEsperaService.iniciar(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/turno/finalizar")
    @PreAuthorize("hasRole('ADMIN') or @citaService.esMedicoDeLaCita(#id, authentication.name)")
    public ResponseEntity<Void> finalizarTurno(@PathVariable Long id) {
        salaEsperaService.finalizar(id);
        return ResponseEntity.ok().build();
    }
}

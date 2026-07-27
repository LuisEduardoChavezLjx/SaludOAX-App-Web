package com.saludoax.backend.controller;

import com.saludoax.backend.dto.PacienteDTO;
import com.saludoax.backend.dto.PageResponse;
import com.saludoax.backend.model.Usuario;
import com.saludoax.backend.repository.UsuarioRepository;
import com.saludoax.backend.service.PacienteService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {

    private final PacienteService pacienteService;
    private final UsuarioRepository usuarioRepository;

    public PacienteController(PacienteService pacienteService, UsuarioRepository usuarioRepository) {
        this.pacienteService = pacienteService;
        this.usuarioRepository = usuarioRepository;
    }

    // Paginacion y filtro reales del lado del servidor:
    // GET /api/pacientes?page=0&size=10&nombre=juan
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MEDICO')")
    public ResponseEntity<PageResponse<PacienteDTO>> listar(
            @RequestParam(required = false) String nombre,
            Pageable pageable) {
        return ResponseEntity.ok(new PageResponse<>(pacienteService.listar(nombre, pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MEDICO','PACIENTE')")
    public ResponseEntity<PacienteDTO> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(pacienteService.obtener(id));
    }

    @GetMapping("/mi-perfil")
    @PreAuthorize("hasRole('PACIENTE')")
    public ResponseEntity<PacienteDTO> miPerfil(Authentication auth) {
        Usuario usuario = usuarioRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        return ResponseEntity.ok(pacienteService.buscarPorUsuarioId(usuario.getId()));
    }

    @PostMapping
    @PreAuthorize("hasRole('PACIENTE')")
    public ResponseEntity<PacienteDTO> crear(@Valid @RequestBody PacienteDTO dto, Authentication auth) {
        PacienteDTO creado = pacienteService.crear(auth.getName(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PACIENTE')")
    public ResponseEntity<PacienteDTO> actualizar(@PathVariable Long id, @Valid @RequestBody PacienteDTO dto) {
        return ResponseEntity.ok(pacienteService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        pacienteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

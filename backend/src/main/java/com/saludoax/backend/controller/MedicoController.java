package com.saludoax.backend.controller;

import com.saludoax.backend.dto.MedicoDTO;
import com.saludoax.backend.dto.PageResponse;
import com.saludoax.backend.dto.TurnoSalaEsperaDTO;
import com.saludoax.backend.model.Usuario;
import com.saludoax.backend.repository.UsuarioRepository;
import com.saludoax.backend.service.MedicoService;
import com.saludoax.backend.service.SalaEsperaService;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicos")
public class MedicoController {

    private final MedicoService medicoService;
    private final SalaEsperaService salaEsperaService;
    private final UsuarioRepository usuarioRepository;

    public MedicoController(MedicoService medicoService, SalaEsperaService salaEsperaService, UsuarioRepository usuarioRepository) {
        this.medicoService = medicoService;
        this.salaEsperaService = salaEsperaService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MEDICO','PACIENTE')")
    public ResponseEntity<PageResponse<MedicoDTO>> listar(
            @RequestParam(required = false) String busqueda,
            @RequestParam(required = false) Long especialidadId,
            Pageable pageable) {
        return ResponseEntity.ok(new PageResponse<>(medicoService.listar(busqueda, especialidadId, pageable)));
    }

    @GetMapping("/mi-perfil")
    @PreAuthorize("hasRole('MEDICO')")
    public ResponseEntity<MedicoDTO> miPerfil(Authentication auth) {
        Usuario usuario = usuarioRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        return ResponseEntity.ok(medicoService.obtenerPorUsuarioId(usuario.getId()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MEDICO','PACIENTE')")
    public ResponseEntity<MedicoDTO> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(medicoService.obtener(id));
    }

    @GetMapping("/{id}/sala-espera")
    @PreAuthorize("hasAnyRole('ADMIN','MEDICO')")
    public ResponseEntity<List<TurnoSalaEsperaDTO>> salaEspera(@PathVariable Long id) {
        return ResponseEntity.ok(salaEsperaService.listarPorMedico(id));
    }
}

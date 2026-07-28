package com.saludoax.backend.controller;

import com.saludoax.backend.dto.*;
import com.saludoax.backend.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/usuarios")
    public ResponseEntity<PageResponse<UsuarioAdminDTO>> listarUsuarios(
            @RequestParam(required = false) String busqueda,
            @RequestParam(required = false) String rol,
            @RequestParam(required = false) Boolean activo,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<UsuarioAdminDTO> page = adminService.listarUsuarios(busqueda, rol, activo, pageable);
        return ResponseEntity.ok(new PageResponse<>(page));
    }

    @PostMapping("/usuarios")
    public ResponseEntity<UsuarioAdminDTO> crearUsuario(@Valid @RequestBody CrearUsuarioRequest request) {
        UsuarioAdminDTO creado = adminService.crearUsuario(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<UsuarioAdminDTO> actualizarUsuario(@PathVariable Long id,
                                                              @Valid @RequestBody ActualizarUsuarioRequest request) {
        UsuarioAdminDTO actualizado = adminService.actualizarUsuario(id, request);
        return ResponseEntity.ok(actualizado);
    }

    @PatchMapping("/usuarios/{id}/desactivar")
    public ResponseEntity<Map<String, String>> desactivarUsuario(@PathVariable Long id, Authentication auth) {
        adminService.desactivarUsuario(id, auth.getName());
        return ResponseEntity.ok(Map.of("mensaje", "Usuario desactivado"));
    }

    @PatchMapping("/usuarios/{id}/reactivar")
    public ResponseEntity<Map<String, String>> reactivarUsuario(@PathVariable Long id) {
        adminService.reactivarUsuario(id);
        return ResponseEntity.ok(Map.of("mensaje", "Usuario reactivado"));
    }

    @GetMapping("/medicos")
    public ResponseEntity<PageResponse<MedicoAdminDTO>> listarMedicos(
            @RequestParam(required = false) String busqueda,
            @RequestParam(required = false) Long especialidad,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<MedicoAdminDTO> page = adminService.listarMedicos(busqueda, especialidad, pageable);
        return ResponseEntity.ok(new PageResponse<>(page));
    }

    @PostMapping("/medicos")
    public ResponseEntity<MedicoAdminDTO> crearMedico(@Valid @RequestBody CrearMedicoRequest request) {
        MedicoAdminDTO creado = adminService.crearMedico(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/medicos/{id}")
    public ResponseEntity<MedicoAdminDTO> actualizarMedico(@PathVariable Long id,
                                                            @Valid @RequestBody CrearMedicoRequest request) {
        MedicoAdminDTO actualizado = adminService.actualizarMedico(id, request);
        return ResponseEntity.ok(actualizado);
    }

    @PatchMapping("/medicos/{id}/desactivar")
    public ResponseEntity<Map<String, String>> desactivarMedico(@PathVariable Long id) {
        adminService.desactivarMedico(id);
        return ResponseEntity.ok(Map.of("mensaje", "Médico desactivado"));
    }

    @PatchMapping("/medicos/{id}/reactivar")
    public ResponseEntity<Map<String, String>> reactivarMedico(@PathVariable Long id) {
        adminService.reactivarMedico(id);
        return ResponseEntity.ok(Map.of("mensaje", "Médico reactivado"));
    }
}

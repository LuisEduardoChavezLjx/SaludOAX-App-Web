package com.saludoax.backend.controller;

import com.saludoax.backend.dto.AuthResponse;
import com.saludoax.backend.dto.LoginRequest;
import com.saludoax.backend.dto.RecuperarRequest;
import com.saludoax.backend.dto.RegisterRequest;
import com.saludoax.backend.dto.RestablecerRequest;
import com.saludoax.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@RequestHeader(HttpHeaders.AUTHORIZATION) String bearerToken) {
        authService.logout(bearerToken);
        return ResponseEntity.ok(Map.of("mensaje", "Sesion cerrada"));
    }

    @PostMapping("/recuperar")
    public ResponseEntity<Map<String, String>> recuperar(@Valid @RequestBody RecuperarRequest request) {
        boolean encontrado = authService.solicitarRecuperacion(request.getEmail());
        if (encontrado) {
            return ResponseEntity.ok(Map.of("mensaje", "Correo enviado, revisa tu bandeja de entrada o spam"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("mensaje", "Usuario no encontrado en el sistema"));
    }

    @PostMapping("/restablecer")
    public ResponseEntity<Map<String, String>> restablecer(@Valid @RequestBody RestablecerRequest request) {
        authService.restablecerPassword(request.getToken(), request.getNuevaPassword());
        return ResponseEntity.ok(Map.of("mensaje", "Contrasena restablecida"));
    }
}

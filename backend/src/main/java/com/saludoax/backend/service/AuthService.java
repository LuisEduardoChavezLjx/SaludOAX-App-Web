package com.saludoax.backend.service;

import com.saludoax.backend.dto.AuthResponse;
import com.saludoax.backend.dto.LoginRequest;
import com.saludoax.backend.dto.RegisterRequest;
import com.saludoax.backend.model.Rol;
import com.saludoax.backend.model.Usuario;
import com.saludoax.backend.repository.RolRepository;
import com.saludoax.backend.repository.UsuarioRepository;
import com.saludoax.backend.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final String ROL_AUTOREGISTRO = "PACIENTE";

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthService(UsuarioRepository usuarioRepository,
                       RolRepository rolRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese email");
        }

        Rol rol = rolRepository.findByNombre(ROL_AUTOREGISTRO)
                .orElseThrow(() -> new IllegalStateException("El rol " + ROL_AUTOREGISTRO + " no existe en la base de datos"));

        Usuario usuario = new Usuario();
        usuario.setEmail(request.getEmail());
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(rol);

        usuarioRepository.save(usuario);

        String token = jwtUtil.generateToken(usuario.getEmail(), rol.getNombre());
        return new AuthResponse(token, usuario.getEmail(), rol.getNombre());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Credenciales invalidas"));

        String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getRol().getNombre());
        return new AuthResponse(token, usuario.getEmail(), usuario.getRol().getNombre());
    }
}

package com.saludoax.backend.service;

import com.saludoax.backend.dto.AuthResponse;
import com.saludoax.backend.dto.LoginRequest;
import com.saludoax.backend.dto.RegisterRequest;
import com.saludoax.backend.model.Paciente;
import com.saludoax.backend.model.PasswordResetToken;
import com.saludoax.backend.model.Rol;
import com.saludoax.backend.model.TokenBlacklist;
import com.saludoax.backend.model.Usuario;
import com.saludoax.backend.repository.PacienteRepository;
import com.saludoax.backend.repository.PasswordResetTokenRepository;
import com.saludoax.backend.repository.RolRepository;
import com.saludoax.backend.repository.TokenBlacklistRepository;
import com.saludoax.backend.repository.UsuarioRepository;
import com.saludoax.backend.security.JwtUtil;
import io.jsonwebtoken.JwtException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Base64;
import java.util.Date;
import java.util.HexFormat;
import java.util.Optional;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private static final String ROL_AUTOREGISTRO = "PACIENTE";
    private static final int RESET_TOKEN_BYTES = 32;
    private static final int RESET_TOKEN_TTL_MIN = 15;

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PacienteRepository pacienteRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final TokenBlacklistRepository tokenBlacklistRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(UsuarioRepository usuarioRepository,
                       RolRepository rolRepository,
                       PacienteRepository pacienteRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil,
                       TokenBlacklistRepository tokenBlacklistRepository,
                       PasswordResetTokenRepository passwordResetTokenRepository) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.pacienteRepository = pacienteRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.tokenBlacklistRepository = tokenBlacklistRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese email");
        }

        Rol rol = rolRepository.findByNombre(ROL_AUTOREGISTRO)
                .orElseThrow(() -> new IllegalStateException("El rol " + ROL_AUTOREGISTRO + " no existe en la base de datos"));

        Usuario usuario = new Usuario();
        usuario.setEmail(request.getEmail());
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setPasswordChangedAt(LocalDateTime.now());
        usuario.setRol(rol);
        usuarioRepository.save(usuario);

        Paciente paciente = new Paciente();
        paciente.setUsuario(usuario);
        paciente.setNombre(deriveNombreDeEmail(request.getEmail()));
        pacienteRepository.save(paciente);

        String token = jwtUtil.generateToken(usuario.getEmail(), rol.getNombre());
        return new AuthResponse(token, usuario.getEmail(), rol.getNombre());
    }

    private String deriveNombreDeEmail(String email) {
        int at = email.indexOf('@');
        return at > 0 ? email.substring(0, at) : email;
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

    public void logout(String bearerToken) {
        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Token no presente");
        }
        String token = bearerToken.substring(7);
        String jti;
        String email;
        Date expiration;
        try {
            jti = jwtUtil.extractJti(token);
            email = jwtUtil.extractEmail(token);
            expiration = jwtUtil.extractExpiration(token);
        } catch (JwtException e) {
            return;
        }

        if (jti == null || tokenBlacklistRepository.existsByTokenJti(jti)) {
            return;
        }

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        LocalDateTime exp = LocalDateTime.ofInstant(
                Instant.ofEpochMilli(expiration.getTime()), ZoneId.systemDefault());

        tokenBlacklistRepository.save(new TokenBlacklist(usuario.getId(), jti, exp));
    }

    public void solicitarRecuperacion(String email) {
        Optional<Usuario> encontrado = usuarioRepository.findByEmail(email);
        if (encontrado.isEmpty()) return;

        Usuario usuario = encontrado.get();
        byte[] bytes = new byte[RESET_TOKEN_BYTES];
        secureRandom.nextBytes(bytes);
        String tokenClaro = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        String tokenHash = sha256Hex(tokenClaro);

        PasswordResetToken registro = new PasswordResetToken(
                usuario.getId(),
                tokenHash,
                LocalDateTime.now().plusMinutes(RESET_TOKEN_TTL_MIN));
        passwordResetTokenRepository.save(registro);

        log.info("[DEV] Token de recuperacion para {}: {}", email, tokenClaro);
    }

    @Transactional
    public void restablecerPassword(String tokenClaro, String nuevaPassword) {
        String tokenHash = sha256Hex(tokenClaro);
        PasswordResetToken registro = passwordResetTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException("Token invalido o expirado"));

        if (Boolean.TRUE.equals(registro.getUsado())
                || registro.getExpiraEn().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token invalido o expirado");
        }

        int actualizadas = passwordResetTokenRepository.marcarUsado(registro.getId());
        if (actualizadas == 0) {
            throw new IllegalArgumentException("Token invalido o expirado");
        }

        Usuario usuario = usuarioRepository.findById(registro.getUsuarioId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        usuario.setPasswordHash(passwordEncoder.encode(nuevaPassword));
        usuario.setPasswordChangedAt(LocalDateTime.now());
        usuarioRepository.save(usuario);
    }

    private String sha256Hex(String raw) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(raw.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 no disponible", e);
        }
    }
}

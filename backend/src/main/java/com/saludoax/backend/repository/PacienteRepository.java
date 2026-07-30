package com.saludoax.backend.repository;

import com.saludoax.backend.model.Paciente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    Optional<Paciente> findByUsuarioId(Long usuarioId);
    Page<Paciente> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);
    boolean existsByIdAndUsuarioEmail(Long id, String email);
}

package com.saludoax.backend.repository;

import com.saludoax.backend.model.Medico;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MedicoRepository extends JpaRepository<Medico, Long> {
    Optional<Medico> findByUsuarioId(Long usuarioId);
}

package com.saludoax.backend.repository;

import com.saludoax.backend.model.Estimacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EstimacionRepository extends JpaRepository<Estimacion, Long> {

    Optional<Estimacion> findByCitaId(Long citaId);
}

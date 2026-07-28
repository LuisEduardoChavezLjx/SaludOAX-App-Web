package com.saludoax.backend.repository;

import com.saludoax.backend.model.EstadoTurno;
import com.saludoax.backend.model.TurnoSalaEspera;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TurnoSalaEsperaRepository extends JpaRepository<TurnoSalaEspera, Long> {

    Optional<TurnoSalaEspera> findByCitaId(Long citaId);

    List<TurnoSalaEspera> findByCita_Medico_IdAndEstadoIn(Long medicoId, List<EstadoTurno> estados);
}

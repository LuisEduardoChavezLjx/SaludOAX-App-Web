package com.saludoax.backend.repository;

import com.saludoax.backend.model.TurnoSalaEspera;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TurnoSalaEsperaRepository extends JpaRepository<TurnoSalaEspera, Long> {

    Optional<TurnoSalaEspera> findByCitaId(Long citaId);

    String ORDEN_TRIAGE =
            "CASE e.gravedad WHEN 'URGENTE' THEN 0 WHEN 'MODERADA' THEN 1 WHEN 'LEVE' THEN 2 ELSE 3 END, t.hora_llegada";

    String SELECT_TURNOS_CON_TRIAGE =
            "SELECT t.cita_id AS citaId, p.nombre AS pacienteNombre, p.telefono AS pacienteTelefono, " +
            "t.estado AS estado, e.gravedad AS gravedad, " +
            "ROW_NUMBER() OVER (ORDER BY " + ORDEN_TRIAGE + ") AS posicion, " +
            "CAST(COALESCE(SUM(COALESCE(e.tiempo_estimado_min, 15)) OVER (ORDER BY " + ORDEN_TRIAGE +
            " ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING), 0) AS SIGNED) AS minutosEsperaEstimados, " +
            "t.hora_llegada AS horaLlegada " +
            "FROM turnos_sala_espera t " +
            "JOIN citas c ON c.id = t.cita_id " +
            "JOIN pacientes p ON p.id = c.paciente_id " +
            "LEFT JOIN estimaciones e ON e.cita_id = t.cita_id ";

    @Query(value = SELECT_TURNOS_CON_TRIAGE +
            "WHERE c.medico_id = :medicoId AND t.estado IN (:estados) " +
            "ORDER BY posicion", nativeQuery = true)
    List<TurnoSalaEsperaProjection> listarConTriageYPosicion(@Param("medicoId") Long medicoId,
                                                              @Param("estados") List<String> estados);


    @Query(value = "SELECT sub.* FROM (" + SELECT_TURNOS_CON_TRIAGE +
            "WHERE c.medico_id = (SELECT c2.medico_id FROM citas c2 WHERE c2.id = :citaId) " +
            "AND t.estado IN (:estados)" +
            ") sub WHERE sub.citaId = :citaId", nativeQuery = true)
    Optional<TurnoSalaEsperaProjection> buscarConTriageYPosicion(@Param("citaId") Long citaId,
                                                                  @Param("estados") List<String> estados);
}

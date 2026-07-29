package com.saludoax.backend.repository;

import com.saludoax.backend.model.Cita;
import com.saludoax.backend.model.EstadoCita;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CitaRepository extends JpaRepository<Cita, Long> {

    Page<Cita> findByEstado(EstadoCita estado, Pageable pageable);

    Page<Cita> findByPacienteId(Long pacienteId, Pageable pageable);

    Page<Cita> findByMedicoId(Long medicoId, Pageable pageable);

    @Query("SELECT c FROM Cita c WHERE c.medico.id = :medicoId " +
           "AND c.estado IN ('PENDIENTE','CONFIRMADA') " +
           "AND c.fechaHora < :fechaHora ORDER BY c.fechaHora ASC")
    List<Cita> findCitasAntesEnFila(@Param("medicoId") Long medicoId, @Param("fechaHora") LocalDateTime fechaHora);

    Optional<Cita> findFirstByPacienteIdAndEstadoInOrderByFechaHoraDesc(Long pacienteId, List<EstadoCita> estados);

    Optional<Cita> findFirstByPacienteIdAndEstadoInOrderByFechaHoraAsc(Long pacienteId, List<EstadoCita> estados);

    @Query("SELECT c FROM Cita c JOIN FETCH c.paciente WHERE c.id = :id")
    Optional<Cita> findByIdConPaciente(@Param("id") Long id);
}

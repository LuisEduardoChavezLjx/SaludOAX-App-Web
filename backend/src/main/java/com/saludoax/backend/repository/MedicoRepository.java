package com.saludoax.backend.repository;

import com.saludoax.backend.model.Medico;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MedicoRepository extends JpaRepository<Medico, Long> {
    Optional<Medico> findByUsuarioId(Long usuarioId);

    boolean existsByIdAndUsuarioEmail(Long id, String email);

    @Query("SELECT m FROM Medico m WHERE " +
           "(:busqueda IS NULL OR m.nombre LIKE %:busqueda% OR m.cedula LIKE %:busqueda%) AND " +
           "(:especialidadId IS NULL OR EXISTS (SELECT 1 FROM m.especialidades e WHERE e.id = :especialidadId))")
    Page<Medico> buscarMedicos(@Param("busqueda") String busqueda,
                               @Param("especialidadId") Long especialidadId,
                               Pageable pageable);
}

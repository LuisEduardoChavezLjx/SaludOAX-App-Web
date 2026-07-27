package com.saludoax.backend.repository;

import com.saludoax.backend.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT u FROM Usuario u WHERE " +
           "(:busqueda IS NULL OR u.nombre LIKE %:busqueda% OR u.email LIKE %:busqueda%) AND " +
           "(:rol IS NULL OR u.rol.nombre = :rol) AND " +
           "(:activo IS NULL OR u.activo = :activo)")
    Page<Usuario> buscarUsuarios(@Param("busqueda") String busqueda,
                                 @Param("rol") String rol,
                                 @Param("activo") Boolean activo,
                                 Pageable pageable);
}

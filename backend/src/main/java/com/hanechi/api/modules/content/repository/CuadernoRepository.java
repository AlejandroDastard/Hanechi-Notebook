package com.hanechi.api.modules.content.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hanechi.api.modules.content.enums.VisibilidadCuaderno;
import com.hanechi.api.modules.content.model.Cuaderno;

@Repository
public interface CuadernoRepository extends JpaRepository<Cuaderno, UUID> {
    Optional<Cuaderno> findByCodigo(String codigo);

    List<Cuaderno> findByUsuarioId(UUID idUsuario);
    List<Cuaderno> findByVisibilidad(VisibilidadCuaderno visibilidad);
    List<Cuaderno> findByUsuarioIdAndVisibilidad(UUID idUsuario, VisibilidadCuaderno visibilidad);

    @Query("SELECT c FROM Cuaderno c JOIN c.usuario u JOIN u.configuracion conf " +
        "WHERE c.estado = 'ACTIVO' " +
        "AND c.visibilidad = 'PUBLICO' " +
        "AND u.estadoUsuario = 'ACTIVO' " +
        "AND conf.perfilPublico = true")
    List<Cuaderno> findPublicosGlobalesValidados();

    @Query("SELECT c FROM Cuaderno c JOIN c.usuario u JOIN u.configuracion conf " +
        "WHERE u.id = :idUsuario " +
        "AND c.estado = 'ACTIVO' " +
        "AND c.visibilidad = 'PUBLICO' " +
        "AND u.estadoUsuario = 'ACTIVO' " +
        "AND conf.perfilPublico = true")
    List<Cuaderno> findPublicosPorUsuarioValidado(@Param("idUsuario") UUID idUsuario);
}
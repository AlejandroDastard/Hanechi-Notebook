package com.hanechi.api.modules.user.repository;

import com.hanechi.api.modules.user.model.Perfil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PerfilRepository extends JpaRepository<Perfil, UUID> {
    @Query("SELECT p FROM Perfil p " +
            "JOIN p.usuario u " +
            "JOIN u.configuracion c " +
            "WHERE (LOWER(p.nombrePerfil) LIKE LOWER(CONCAT('%', :nombre, '%')) " +
            "OR LOWER(u.nombreUsuario) LIKE LOWER(CONCAT('%', :nombre, '%'))) " +
            "AND u.estadoUsuario = 'ACTIVO' " +
            "AND c.perfilPublico = true")
    List<Perfil> buscarPerfilesPublicos(@Param("nombre") String nombre);
}
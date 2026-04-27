package com.hanechi.api.modules.social.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hanechi.api.modules.social.model.Relacion;
import com.hanechi.api.modules.social.model.keys.ClaveRelacion;

@Repository
public interface RelacionRepository extends JpaRepository<Relacion, ClaveRelacion> {
    List<Relacion> findByEmisorId(UUID idEmisor);
    List<Relacion> findByReceptorId(UUID idReceptor);

    @Query("SELECT r FROM Relacion r JOIN r.emisor e " +
        "WHERE r.id.idReceptor = :idUsuario " +
        "AND e.estadoUsuario = 'ACTIVO'")
    List<Relacion> findSeguidoresActivos(@Param("idUsuario") UUID idUsuario);

    @Query("SELECT r FROM Relacion r JOIN r.receptor rec " +
           "WHERE r.id.idEmisor = :idUsuario " +
           "AND rec.estadoUsuario = 'ACTIVO'")
    List<Relacion> findSiguiendoActivos(@Param("idUsuario") UUID idUsuario);
}
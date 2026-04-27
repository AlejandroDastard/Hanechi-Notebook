package com.hanechi.api.modules.user.repository;

import com.hanechi.api.modules.user.model.Sesion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface SesionRepository extends JpaRepository<Sesion, UUID> {
    List<Sesion> findByUsuarioId(UUID idUsuario);

    void deleteByFechaExpiracionBefore(ZonedDateTime fecha);
}

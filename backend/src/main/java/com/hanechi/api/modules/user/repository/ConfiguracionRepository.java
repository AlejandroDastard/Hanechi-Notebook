package com.hanechi.api.modules.user.repository;

import com.hanechi.api.modules.user.model.Configuracion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConfiguracionRepository extends JpaRepository<Configuracion, UUID> {
    Optional<Configuracion> findByUsuarioId(UUID usuarioId);
}
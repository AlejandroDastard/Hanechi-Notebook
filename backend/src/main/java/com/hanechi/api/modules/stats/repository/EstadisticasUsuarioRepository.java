package com.hanechi.api.modules.stats.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hanechi.api.modules.stats.model.EstadisticasUsuario;

@Repository
public interface EstadisticasUsuarioRepository extends JpaRepository<EstadisticasUsuario, UUID> {

    Optional<EstadisticasUsuario> findByUsuarioId(UUID idUsuario);
}
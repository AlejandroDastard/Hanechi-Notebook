package com.hanechi.api.modules.stats.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hanechi.api.modules.stats.model.EstadisticasCuaderno;

@Repository
public interface EstadisticasCuadernoRepository extends JpaRepository<EstadisticasCuaderno, UUID> {

    Optional<EstadisticasCuaderno> findByCuadernoId(UUID idCuaderno);

}
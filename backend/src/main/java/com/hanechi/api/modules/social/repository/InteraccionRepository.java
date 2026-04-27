package com.hanechi.api.modules.social.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hanechi.api.modules.social.enums.TipoInteraccion;
import com.hanechi.api.modules.social.model.Interaccion;

@Repository
public interface InteraccionRepository extends JpaRepository<Interaccion, UUID> {
    List<Interaccion> findByCuadernoId(UUID idCuaderno);

    Optional<Interaccion> findByCuadernoIdAndUsuarioIdAndTipoInteraccion(UUID idCuaderno, UUID idUsuario, TipoInteraccion tipo);
}
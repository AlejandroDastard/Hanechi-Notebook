package com.hanechi.api.modules.user.repository;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.hanechi.api.modules.user.model.CodigoVerificacion;

@Repository
public interface CodigoVerificacionRepository extends JpaRepository<CodigoVerificacion, UUID> {
    Optional<CodigoVerificacion> findByCorreoAndCodigo(String correo, String codigo);

    void deleteByCorreo(String correo);
}

package com.hanechi.api.modules.user.dto;

import java.time.ZonedDateTime;
import java.util.UUID;

import com.hanechi.api.modules.user.model.Sesion;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SesionDTO {
    private UUID id;
    private UUID idUsuario;
    private String dispositivo;
    private ZonedDateTime fechaInicio;
    private ZonedDateTime fechaExpiracion;

    public SesionDTO(Sesion entity) {
        if (entity != null) {
            this.id = entity.getId();
            if (entity.getUsuario() != null) {
                this.idUsuario = entity.getUsuario().getId();
            }
            this.dispositivo = entity.getDispositivo();
            this.fechaInicio = entity.getFechaInicio();
            this.fechaExpiracion = entity.getFechaExpiracion();
        }
    }
}
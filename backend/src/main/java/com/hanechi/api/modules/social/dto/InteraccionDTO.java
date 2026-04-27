package com.hanechi.api.modules.social.dto;

import java.time.ZonedDateTime;
import java.util.UUID;

import com.hanechi.api.modules.social.enums.TipoInteraccion;
import com.hanechi.api.modules.social.model.Interaccion;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class InteraccionDTO {
    private UUID id;
    private UUID idCuaderno;
    private UUID idUsuario;
    private TipoInteraccion tipoInteraccion;
    private ZonedDateTime fechaInteraccion;

    public InteraccionDTO(Interaccion entity) {
        if (entity != null) {
            this.id = entity.getId();
            if (entity.getCuaderno() != null) {
                this.idCuaderno = entity.getCuaderno().getId();
            }
            if (entity.getUsuario() != null) {
                this.idUsuario = entity.getUsuario().getId();
            }
            this.tipoInteraccion = entity.getTipoInteraccion();
            this.fechaInteraccion = entity.getFechaInteraccion();
        }
    }
}
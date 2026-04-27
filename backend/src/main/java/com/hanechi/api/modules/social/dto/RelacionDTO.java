package com.hanechi.api.modules.social.dto;

import java.time.ZonedDateTime;
import java.util.UUID;

import com.hanechi.api.modules.social.model.Relacion;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RelacionDTO {
    private UUID idEmisor;
    private UUID idReceptor;
    private ZonedDateTime fechaInteraccion;

    public RelacionDTO(Relacion entity) {
        if (entity != null) {
            if (entity.getId() != null) {
                this.idEmisor = entity.getId().getIdEmisor();
                this.idReceptor = entity.getId().getIdReceptor();
            }
            this.fechaInteraccion = entity.getFechaInteraccion();
        }
    }
}

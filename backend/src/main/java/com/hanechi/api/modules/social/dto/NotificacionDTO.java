package com.hanechi.api.modules.social.dto;

import java.util.UUID;

import com.hanechi.api.modules.social.enums.TipoNotificacion;
import com.hanechi.api.modules.social.enums.TipoReferencia;
import com.hanechi.api.modules.social.model.Notificacion;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class NotificacionDTO {
    private UUID id;
    private UUID idEmisor;
    private UUID idReceptor;
    private UUID idReferencia;
    private TipoReferencia tipoReferencia;
    private TipoNotificacion tipoNotificacion;

    public NotificacionDTO(Notificacion entity) {
        if (entity != null) {
            this.id = entity.getId();
            if (entity.getEmisor() != null) {
                this.idEmisor = entity.getEmisor().getId();
            }
            if (entity.getReceptor() != null) {
                this.idReceptor = entity.getReceptor().getId();
            }
            this.idReferencia = entity.getIdReferencia();
            this.tipoReferencia = entity.getTipoReferencia();
            this.tipoNotificacion = entity.getTipoNotificacion();
        }
    }
}

package com.hanechi.api.modules.social.model;

import java.util.UUID;

import com.hanechi.api.modules.social.dto.NotificacionDTO;
import com.hanechi.api.modules.social.enums.TipoNotificacion;
import com.hanechi.api.modules.social.enums.TipoReferencia;
import com.hanechi.api.modules.user.model.Usuario;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "notificacion")
@Data
@NoArgsConstructor
public class Notificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_notificacion")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_emisor", nullable = false)
    private Usuario emisor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_receptor", nullable = false)
    private Usuario receptor;

    @Column(name = "id_referencia", nullable = false)
    private UUID idReferencia;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_referencia", nullable = false)
    private TipoReferencia tipoReferencia;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_notificacion", nullable = false)
    private TipoNotificacion tipoNotificacion;

    public Notificacion(NotificacionDTO dto) {
        if (dto != null) {
            this.id = dto.getId();
            this.idReferencia = dto.getIdReferencia();
            this.tipoReferencia = dto.getTipoReferencia();
            this.tipoNotificacion = dto.getTipoNotificacion();
        }
    }
}

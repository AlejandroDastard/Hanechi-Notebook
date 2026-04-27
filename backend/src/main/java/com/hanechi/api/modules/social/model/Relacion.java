package com.hanechi.api.modules.social.model;

import java.time.ZonedDateTime;

import com.hanechi.api.modules.social.dto.RelacionDTO;
import com.hanechi.api.modules.social.model.keys.ClaveRelacion;
import com.hanechi.api.modules.user.model.Usuario;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "relacion")
@Data
@NoArgsConstructor
public class Relacion {
    @EmbeddedId
    private ClaveRelacion id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idEmisor")
    @JoinColumn(name = "id_emisor")
    private Usuario emisor;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idReceptor")
    @JoinColumn(name = "id_receptor")
    private Usuario receptor;

    @Column(name = "fecha_interaccion", nullable = false)
    private ZonedDateTime fechaInteraccion;

    public Relacion(RelacionDTO dto) {
        if (dto != null) {
            this.fechaInteraccion = dto.getFechaInteraccion();
        }
    }
}

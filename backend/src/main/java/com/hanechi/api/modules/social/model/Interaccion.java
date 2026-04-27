package com.hanechi.api.modules.social.model;

import java.time.ZonedDateTime;
import java.util.UUID;

import com.hanechi.api.modules.content.model.Cuaderno;
import com.hanechi.api.modules.social.dto.InteraccionDTO;
import com.hanechi.api.modules.social.enums.TipoInteraccion;
import com.hanechi.api.modules.user.model.Usuario;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "interaccion")
@Data
@NoArgsConstructor
public class Interaccion {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_interaccion")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cuaderno", nullable = false)
    private Cuaderno cuaderno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_interaccion", nullable = false)
    private TipoInteraccion tipoInteraccion;

    @Column(name = "fecha_interaccion", nullable = false)
    private ZonedDateTime fechaInteraccion;

    public Interaccion(InteraccionDTO dto) {
        if (dto != null) {
            this.id = dto.getId();
            this.tipoInteraccion = dto.getTipoInteraccion();
            this.fechaInteraccion = dto.getFechaInteraccion();
        }
    }
}
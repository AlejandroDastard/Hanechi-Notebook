package com.hanechi.api.modules.user.model;

import java.time.ZonedDateTime;
import java.util.UUID;

import com.hanechi.api.modules.user.dto.SesionDTO;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sesion")
@Data
@NoArgsConstructor
public class Sesion {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_sesion")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "dispositivo")
    private String dispositivo;

    @Column(name = "fecha_inicio", nullable = false)
    private ZonedDateTime fechaInicio;

    @Column(name = "fecha_expiracion", nullable = false)
    private ZonedDateTime fechaExpiracion;

    public Sesion(SesionDTO dto, Usuario usuario) {
        if (dto != null) {
            this.id = dto.getId();
            this.usuario = usuario;
            this.dispositivo = dto.getDispositivo();
            this.fechaInicio = dto.getFechaInicio();
            this.fechaExpiracion = dto.getFechaExpiracion();
        }
    }
}
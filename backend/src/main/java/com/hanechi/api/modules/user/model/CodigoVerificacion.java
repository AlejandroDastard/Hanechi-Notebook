package com.hanechi.api.modules.user.model;

import java.time.ZonedDateTime;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "codigo_verificacion")
@Data
@NoArgsConstructor
public class CodigoVerificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String correo;

    @Column(nullable = false)
    private String codigo;

    @Column(nullable = false)
    private ZonedDateTime fechaExpiracion;

    public CodigoVerificacion(String correo, String codigo, ZonedDateTime expiracion) {
        this.correo = correo;
        this.codigo = codigo;
        this.fechaExpiracion = expiracion;
    }
}

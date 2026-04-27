package com.hanechi.api.modules.stats.model;

import java.time.ZonedDateTime;
import java.util.UUID;

import com.hanechi.api.modules.content.model.Cuaderno;
import com.hanechi.api.modules.stats.dto.EstadisticasCuadernoDTO;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "estadistica_cuaderno")
@Data
@NoArgsConstructor
public class EstadisticasCuaderno {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_estadistica_cuaderno")
    private UUID id;

    @Column(name = "total_paginas", nullable = false)
    private Integer totalPaginas = 0;

    @Column(name = "total_visitas", nullable = false)
    private Integer totalVisitas = 0;

    @Column(name = "total_likes", nullable = false)
    private Integer totalLikes = 0;

    @Column(name = "total_guardados", nullable = false)
    private Integer totalGuardados = 0;

    @Column(name = "ultima_actividad", nullable = false)
    private ZonedDateTime ultimaActividad;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cuaderno", unique = true)
    private Cuaderno cuaderno;

    public EstadisticasCuaderno(final EstadisticasCuadernoDTO dto) {
        if (dto != null) {
            this.totalPaginas = dto.getTotalPaginas();
            this.totalVisitas = dto.getTotalVisitas();
            this.totalLikes = dto.getTotalLikes();
            this.totalGuardados = dto.getTotalGuardados();
            this.ultimaActividad = dto.getUltimaActividad();
        }
    }
}
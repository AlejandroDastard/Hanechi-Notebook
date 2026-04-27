package com.hanechi.api.modules.stats.dto;

import java.time.ZonedDateTime;
import java.util.UUID;

import com.hanechi.api.modules.stats.model.EstadisticasCuaderno;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EstadisticasCuadernoDTO {
    private UUID idCuaderno;
    private Integer totalPaginas;
    private Integer totalVisitas;
    private Integer totalLikes;
    private Integer totalGuardados;
    private ZonedDateTime ultimaActividad;

    public EstadisticasCuadernoDTO(final EstadisticasCuaderno entity) {
        if (entity != null) {
            this.idCuaderno = entity.getId();
            this.totalPaginas = entity.getTotalPaginas();
            this.totalVisitas = entity.getTotalVisitas();
            this.totalLikes = entity.getTotalLikes();
            this.totalGuardados = entity.getTotalGuardados();
            this.ultimaActividad = entity.getUltimaActividad();
        }
    }
}
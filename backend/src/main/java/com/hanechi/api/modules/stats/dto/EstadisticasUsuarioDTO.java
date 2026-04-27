package com.hanechi.api.modules.stats.dto;

import java.time.ZonedDateTime;
import java.util.UUID;

import com.hanechi.api.modules.stats.model.EstadisticasUsuario;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EstadisticasUsuarioDTO {
    private UUID idUsuario;
    private Integer totalSeguidores;
    private Integer totalSiguiendo;
    private Integer totalCuadernos;
    private Integer totalVistas;
    private Integer totalLikes;
    private ZonedDateTime ultimaActividad;

    public EstadisticasUsuarioDTO(EstadisticasUsuario entity) {
        if (entity != null) {
            this.idUsuario = entity.getId();
            this.totalSeguidores = entity.getTotalSeguidores();
            this.totalSiguiendo = entity.getTotalSiguiendo();
            this.totalCuadernos = entity.getTotalCuadernos();
            this.totalVistas = entity.getTotalVistas();
            this.totalLikes = entity.getTotalLikes();
            this.ultimaActividad = entity.getUltimaActividad();
        }
    }
}

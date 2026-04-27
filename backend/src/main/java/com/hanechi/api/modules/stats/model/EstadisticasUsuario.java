package com.hanechi.api.modules.stats.model;

import java.time.ZonedDateTime;
import java.util.UUID;

import com.hanechi.api.modules.stats.dto.EstadisticasUsuarioDTO;
import com.hanechi.api.modules.user.model.Usuario;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "estadistica_usuario")
@Data
@NoArgsConstructor
public class EstadisticasUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_estadistica_usuario")
    private UUID id;

    @Column(name = "total_seguidores", nullable = false)
    private Integer totalSeguidores = 0;

    @Column(name = "total_siguiendo", nullable = false)
    private Integer totalSiguiendo = 0;

    @Column(name = "total_cuadernos", nullable = false)
    private Integer totalCuadernos = 0;

    @Column(name = "total_vistas", nullable = false)
    private Integer totalVistas = 0;

    @Column(name = "total_likes", nullable = false)
    private Integer totalLikes = 0;

    @Column(name = "ultima_actividad", nullable = false)
    private ZonedDateTime ultimaActividad;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", unique = true)
    private Usuario usuario;

    public EstadisticasUsuario(EstadisticasUsuarioDTO dto) {
        if (dto != null) {
            this.totalSeguidores = dto.getTotalSeguidores();
            this.totalSiguiendo = dto.getTotalSiguiendo();
            this.totalCuadernos = dto.getTotalCuadernos();
            this.totalVistas = dto.getTotalVistas();
            this.totalLikes = dto.getTotalLikes();
            this.ultimaActividad = dto.getUltimaActividad();
        }
    }
}
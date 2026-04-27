package com.hanechi.api.modules.content.dto;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.hanechi.api.modules.content.enums.EstadoCuaderno;
import com.hanechi.api.modules.content.enums.VisibilidadCuaderno;
import com.hanechi.api.modules.content.model.Cuaderno;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CuadernoDTO {
    private UUID id;
    private UUID idUsuario;
    private String titulo;
    private String urlPortada;
    private String descripcion;
    private String codigo;
    private VisibilidadCuaderno visibilidad;
    private List<EtiquetaDTO> etiquetas;
    private EstadoCuaderno estado;
    private ZonedDateTime fechaCreacion;
    private ZonedDateTime fechaActualizado;

    public CuadernoDTO(Cuaderno entity) {
        if (entity != null) {
            this.id = entity.getId();
            if (entity.getUsuario() != null) {
                this.idUsuario = entity.getUsuario().getId();
            }
            this.titulo = entity.getTitulo();
            this.urlPortada = entity.getUrlPortada();
            this.descripcion = entity.getDescripcion();
            this.codigo = entity.getCodigo();
            this.estado = entity.getEstado();
            this.fechaCreacion = entity.getFechaCreacion();
            this.fechaActualizado = entity.getFechaActualizado();
            this.visibilidad = entity.getVisibilidad();

            if (entity.getEtiquetas() != null) {
                this.etiquetas = entity.getEtiquetas().stream()
                    .map(EtiquetaDTO::new)
                    .collect(Collectors.toList());
            }
        }
    }
}
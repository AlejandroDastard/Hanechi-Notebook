package com.hanechi.api.modules.content.dto;

import java.util.List;
import java.util.UUID;

import lombok.Data;

@Data
public class ActualizacionCuadernoDTO {
    private String descripcion;
    private List<UUID> idEtiquetas;
}
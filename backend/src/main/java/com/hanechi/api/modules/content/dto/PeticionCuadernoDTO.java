package com.hanechi.api.modules.content.dto;

import java.util.List;
import java.util.UUID;

import com.hanechi.api.modules.content.enums.VisibilidadCuaderno;

import lombok.Data;

@Data
public class PeticionCuadernoDTO {
    private String titulo;
    private String urlPortada;
    private String descripcion;
    private VisibilidadCuaderno visibilidad;
    private List<UUID> idEtiquetas;
}
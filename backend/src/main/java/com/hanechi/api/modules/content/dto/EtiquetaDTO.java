package com.hanechi.api.modules.content.dto;

import java.util.UUID;

import com.hanechi.api.modules.content.model.Etiqueta;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EtiquetaDTO {
    private UUID id;
    private String nombre;

    public EtiquetaDTO(Etiqueta entity) {
        if (entity != null) {
            this.id = entity.getId();
            this.nombre = entity.getNombre();
        }
    }
}
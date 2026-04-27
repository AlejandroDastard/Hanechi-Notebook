package com.hanechi.api.modules.content.dto;

import java.util.UUID;

import com.hanechi.api.modules.content.enums.TipoElemento;
import com.hanechi.api.modules.content.model.ElementoPagina;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ElementoPaginaDTO {
    private UUID id;
    private UUID idPagina;
    private Integer orden;
    private TipoElemento tipo;
    private String contenido;

    public ElementoPaginaDTO(ElementoPagina entity) {
        if (entity != null) {
            this.id = entity.getId();
            if (entity.getPagina() != null) {
                this.idPagina = entity.getPagina().getId();
            }
            this.orden = entity.getOrden();
            this.tipo = entity.getTipo();
            this.contenido = entity.getContenido();
        }
    }
}
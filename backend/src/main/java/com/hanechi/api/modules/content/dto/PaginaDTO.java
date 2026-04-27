package com.hanechi.api.modules.content.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.hanechi.api.modules.content.model.Pagina;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PaginaDTO {
    private UUID id;
    private UUID idCuaderno;
    private Integer numeroPagina;
    private List<ElementoPaginaDTO> elementos = new ArrayList<>();

    public PaginaDTO(Pagina entity) {
        if (entity != null) {
            this.id = entity.getId();
            if (entity.getCuaderno() != null) {
                this.idCuaderno = entity.getCuaderno().getId();
            }
            this.numeroPagina = entity.getNumeroPagina();
            if (entity.getElementos() != null) {
                this.elementos = entity.getElementos().stream()
                        .map(ElementoPaginaDTO::new)
                        .collect(Collectors.toList());
            }
        }
    }
}
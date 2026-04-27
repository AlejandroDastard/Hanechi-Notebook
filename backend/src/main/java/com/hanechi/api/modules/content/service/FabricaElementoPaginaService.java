package com.hanechi.api.modules.content.service;

import org.springframework.stereotype.Service;

import com.hanechi.api.modules.content.dto.ElementoPaginaDTO;
import com.hanechi.api.modules.content.model.ElementoPagina;
import com.hanechi.api.modules.content.model.Pagina;

@Service
public class FabricaElementoPaginaService {
    public ElementoPaginaDTO crearDTO(ElementoPagina entidad) {
        return new ElementoPaginaDTO(entidad);
    }

    public ElementoPagina crearElemento(ElementoPaginaDTO dto, Pagina pagina) {
        ElementoPagina elemento = new ElementoPagina();
        if (dto.getId() != null) {
            elemento.setId(dto.getId());
        }
        elemento.setPagina(pagina);
        elemento.setOrden(dto.getOrden());
        elemento.setTipo(dto.getTipo());
        elemento.setContenido(dto.getContenido());
        return elemento;
    }
}

package com.hanechi.api.modules.content.service;

import org.springframework.stereotype.Service;

import com.hanechi.api.modules.content.dto.PeticionPaginaDTO;
import com.hanechi.api.modules.content.model.Cuaderno;
import com.hanechi.api.modules.content.model.Pagina;

@Service
public class FabricaPaginaService {
    public Pagina crearPagina(PeticionPaginaDTO dto, Cuaderno cuaderno) {
        Pagina pagina = new Pagina();
        pagina.setCuaderno(cuaderno);
        pagina.setNumeroPagina(dto.getNumeroPagina());
        return pagina;
    }
}
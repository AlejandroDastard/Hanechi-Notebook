package com.hanechi.api.modules.stats.service;

import java.time.ZonedDateTime;

import org.springframework.stereotype.Service;

import com.hanechi.api.modules.content.model.Cuaderno;
import com.hanechi.api.modules.stats.model.EstadisticasCuaderno;

@Service
public class FabricaEstadisticasCuadernoService {
    public EstadisticasCuaderno crearEstadisticasBase(final Cuaderno cuaderno) {
        EstadisticasCuaderno estadisticas = new EstadisticasCuaderno();

        estadisticas.setCuaderno(cuaderno);
        estadisticas.setTotalPaginas(0);
        estadisticas.setTotalVisitas(0);
        estadisticas.setTotalLikes(0);
        estadisticas.setTotalGuardados(0);
        estadisticas.setUltimaActividad(ZonedDateTime.now());
        
        return estadisticas;
    }
}
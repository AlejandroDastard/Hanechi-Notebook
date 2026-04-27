package com.hanechi.api.modules.stats.service;

import java.time.ZonedDateTime;

import org.springframework.stereotype.Service;

import com.hanechi.api.modules.stats.model.EstadisticasUsuario;
import com.hanechi.api.modules.user.model.Usuario;

@Service
public class FabricaEstadisticasUsuarioService {
    public EstadisticasUsuario crearEstadisticasBase(Usuario usuario) {
        EstadisticasUsuario estadisticas = new EstadisticasUsuario();

        estadisticas.setUsuario(usuario);
        estadisticas.setTotalSeguidores(0);
        estadisticas.setTotalSiguiendo(0);
        estadisticas.setTotalCuadernos(0);
        estadisticas.setTotalVistas(0);
        estadisticas.setTotalLikes(0);
        estadisticas.setUltimaActividad(ZonedDateTime.now());
        
        return estadisticas;
    }
}
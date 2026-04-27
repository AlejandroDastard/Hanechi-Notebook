package com.hanechi.api.modules.user.service;

import org.springframework.stereotype.Service;

import com.hanechi.api.modules.user.dto.ConfiguracionDTO;
import com.hanechi.api.modules.user.enums.NivelNotificacion;
import com.hanechi.api.modules.user.enums.PreferenciaContenido;
import com.hanechi.api.modules.user.model.Configuracion;
import com.hanechi.api.modules.user.model.Usuario;

@Service
public class FabricaConfiguracionService {
    public ConfiguracionDTO crearDTO(Configuracion entidad) {
        return new ConfiguracionDTO(entidad);
    }

    public Configuracion crearConfiguracionBase(Usuario usuario) {
        Configuracion entidad = new Configuracion();
        entidad.setUsuario(usuario);
        entidad.setTema("claro");
        entidad.setIdioma("es");
        entidad.setPerfilPublico(true);
        entidad.setMostrarEstadisticas(true);
        entidad.setNivelNotificacion(NivelNotificacion.TODOS);
        entidad.setPreferenciaContenido(PreferenciaContenido.TODO_PUBLICO);
        entidad.setAutoguardadoActivo(true);
        
        return entidad;
    }

    public void actualizarEntidad(Configuracion entidad, ConfiguracionDTO dto) {
        if (dto != null) {
            entidad.setPerfilPublico(dto.getPerfilPublico());
            entidad.setMostrarEstadisticas(dto.getMostrarEstadisticas());
            entidad.setTema(dto.getTema());
            entidad.setIdioma(dto.getIdioma());
            entidad.setNivelNotificacion(dto.getNivelNotificacion());
            entidad.setPreferenciaContenido(dto.getPreferenciaContenido());
            entidad.setAutoguardadoActivo(dto.getAutoguardadoActivo());
        }
    }
}
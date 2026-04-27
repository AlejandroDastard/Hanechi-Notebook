package com.hanechi.api.modules.user.service;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.hanechi.api.modules.user.dto.ActualizacionConfiguracionDTO;
import com.hanechi.api.modules.user.dto.ConfiguracionDTO;
import com.hanechi.api.modules.user.model.Configuracion;
import com.hanechi.api.modules.user.repository.ConfiguracionRepository;

@Service
public class ConfiguracionService {
    private final ConfiguracionRepository configuracionRepository;

    public ConfiguracionService(ConfiguracionRepository configuracionRepository) {
        this.configuracionRepository = configuracionRepository;
    }

    // --- GET ---

    @Transactional(readOnly = true)
    public ConfiguracionDTO obtenerPorUsuarioId(UUID usuarioId) {
        Configuracion entidad = configuracionRepository.findByUsuarioId(usuarioId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Configuracion no encontrada"));

        return new ConfiguracionDTO(entidad);
    }

    // --- PATCH ---

    @Transactional
    public ConfiguracionDTO actualizar(UUID id, ActualizacionConfiguracionDTO dto) {
        Configuracion entidad = configuracionRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Configuracion no encontrada"));

        if (dto.getPerfilPublico() != null) {
            entidad.setPerfilPublico(dto.getPerfilPublico());
        }
        if (dto.getMostrarEstadisticas() != null) {
            entidad.setMostrarEstadisticas(dto.getMostrarEstadisticas());
        }
        if (dto.getTema() != null) {
            entidad.setTema(dto.getTema());
        }
        if (dto.getIdioma() != null) {
            entidad.setIdioma(dto.getIdioma());
        }
        if (dto.getNivelNotificacion() != null) {
            entidad.setNivelNotificacion(dto.getNivelNotificacion());
        }
        if (dto.getPreferenciaContenido() != null) {
            entidad.setPreferenciaContenido(dto.getPreferenciaContenido());
        }
        if (dto.getAutoguardadoActivo() != null) {
            entidad.setAutoguardadoActivo(dto.getAutoguardadoActivo());
        }

        Configuracion actualizada = configuracionRepository.save(entidad);

        return new ConfiguracionDTO(actualizada);
    }
}
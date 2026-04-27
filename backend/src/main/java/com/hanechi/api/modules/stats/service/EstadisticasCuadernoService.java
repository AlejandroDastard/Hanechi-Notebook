package com.hanechi.api.modules.stats.service;

import java.time.ZonedDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hanechi.api.modules.social.enums.TipoInteraccion;
import com.hanechi.api.modules.stats.dto.EstadisticasCuadernoDTO;
import com.hanechi.api.modules.stats.model.EstadisticasCuaderno;
import com.hanechi.api.modules.stats.repository.EstadisticasCuadernoRepository;

@Service
public class EstadisticasCuadernoService {
    private final EstadisticasCuadernoRepository repository;

    public EstadisticasCuadernoService(EstadisticasCuadernoRepository repository) {
        this.repository = repository;
    }

    // --- GET ---

    @Transactional(readOnly = true)
    public EstadisticasCuadernoDTO obtenerEstadisticas(UUID idCuaderno) {
        EstadisticasCuaderno stats = repository.findByCuadernoId(idCuaderno)
                .orElseThrow(() -> new RuntimeException("Estadisticas no encontradas"));
        return new EstadisticasCuadernoDTO(stats);
    }

    // --- PATCH ---

    @Transactional
    public void actualizarPorInteraccion(UUID idCuaderno, TipoInteraccion tipo, boolean incremento) {
        EstadisticasCuaderno stats = repository.findByCuadernoId(idCuaderno)
                .orElseThrow(() -> new RuntimeException("Estadisticas no encontradas"));

        int valor = incremento ? 1 : -1;

        switch (tipo) {
            case LIKE -> stats.setTotalLikes(Math.max(0, stats.getTotalLikes() + valor));
            case VISTA -> {
                if (incremento) stats.setTotalVisitas(stats.getTotalVisitas() + 1);
            }
            case GUARDADO -> stats.setTotalGuardados(Math.max(0, stats.getTotalGuardados() + valor));
        }

        stats.setUltimaActividad(ZonedDateTime.now());
        repository.save(stats);
    }
}
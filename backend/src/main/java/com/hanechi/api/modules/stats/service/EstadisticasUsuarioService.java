package com.hanechi.api.modules.stats.service;

import java.time.ZonedDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hanechi.api.modules.social.enums.TipoInteraccion;
import com.hanechi.api.modules.stats.repository.EstadisticasUsuarioRepository;
import com.hanechi.api.modules.stats.model.EstadisticasUsuario;

@Service
public class EstadisticasUsuarioService {
    private final EstadisticasUsuarioRepository repository;

    public EstadisticasUsuarioService(EstadisticasUsuarioRepository repository) {
        this.repository = repository;
    }

    // --- GET ---

    @Transactional(readOnly = true)
    public EstadisticasUsuario obtenerEstadisticas(UUID idUsuario) {
        return repository.findByUsuarioId(idUsuario)
                .orElseThrow(() -> new RuntimeException("Estadisticas de usuario no encontradas"));
    }

    // --- PATCH ---

    @Transactional
    public void actualizarContadorCuadernos(UUID idUsuario, boolean incremento) {
        EstadisticasUsuario stats = obtenerEstadisticas(idUsuario);
        int valor = incremento ? 1 : -1;
        stats.setTotalCuadernos(Math.max(0, stats.getTotalCuadernos() + valor));
        stats.setUltimaActividad(ZonedDateTime.now());
        repository.save(stats);
    }

    @Transactional
    public void actualizarContadoresRelacion(UUID idEmisor, UUID idReceptor, boolean incremento) {
        EstadisticasUsuario statsEmisor = obtenerEstadisticas(idEmisor);
        EstadisticasUsuario statsReceptor = obtenerEstadisticas(idReceptor);

        int valor = incremento ? 1 : -1;

        statsEmisor.setTotalSiguiendo(Math.max(0, statsEmisor.getTotalSiguiendo() + valor));
        statsReceptor.setTotalSeguidores(Math.max(0, statsReceptor.getTotalSeguidores() + valor));

        ZonedDateTime ahora = ZonedDateTime.now();
        statsEmisor.setUltimaActividad(ahora);
        statsReceptor.setUltimaActividad(ahora);

        repository.save(statsEmisor);
        repository.save(statsReceptor);
    }

    @Transactional
    public void actualizarPorInteraccion(UUID idUsuario, TipoInteraccion tipo, boolean incremento) {
        EstadisticasUsuario stats = obtenerEstadisticas(idUsuario);
        int valor = incremento ? 1 : -1;

        switch (tipo) {
            case LIKE -> stats.setTotalLikes(Math.max(0, stats.getTotalLikes() + valor));
            case GUARDADO -> stats.setTotalVistas(Math.max(0, stats.getTotalVistas() + valor));
            case VISTA -> {
                if (incremento) stats.setTotalVistas(stats.getTotalVistas() + 1);
            }
        }

        stats.setUltimaActividad(ZonedDateTime.now());
        repository.save(stats);
    }
}
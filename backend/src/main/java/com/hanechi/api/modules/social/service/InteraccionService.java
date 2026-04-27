package com.hanechi.api.modules.social.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hanechi.api.modules.content.model.Cuaderno;
import com.hanechi.api.modules.content.repository.CuadernoRepository;
import com.hanechi.api.modules.social.dto.InteraccionDTO;
import com.hanechi.api.modules.social.enums.TipoInteraccion;
import com.hanechi.api.modules.social.model.Interaccion;
import com.hanechi.api.modules.social.repository.InteraccionRepository;
import com.hanechi.api.modules.stats.service.EstadisticasCuadernoService;
import com.hanechi.api.modules.stats.service.EstadisticasUsuarioService;
import com.hanechi.api.modules.user.model.Usuario;
import com.hanechi.api.modules.user.repository.UsuarioRepository;

@Service
public class InteraccionService {
    private final InteraccionRepository interaccionRepository;
    private final CuadernoRepository cuadernoRepository;
    private final UsuarioRepository usuarioRepository;
    private final NotificacionService notificacionService;
    private final EstadisticasCuadernoService statsCuadernoService;
    private final EstadisticasUsuarioService statsUsuarioService;
    private final FabricaInteraccionService fabricaInteraccionService;

    public InteraccionService(InteraccionRepository interaccionRepository, CuadernoRepository cuadernoRepository, UsuarioRepository usuarioRepository, NotificacionService notificacionService, EstadisticasCuadernoService statsCuadernoService, EstadisticasUsuarioService statsUsuarioService, FabricaInteraccionService fabricaInteraccionService) {
        this.interaccionRepository = interaccionRepository;
        this.cuadernoRepository = cuadernoRepository;
        this.usuarioRepository = usuarioRepository;
        this.notificacionService = notificacionService;
        this.statsCuadernoService = statsCuadernoService;
        this.statsUsuarioService = statsUsuarioService;
        this.fabricaInteraccionService = fabricaInteraccionService;
    }

    // --- POST ---

    @Transactional
    public InteraccionDTO registrarInteraccion(InteraccionDTO dto) {
        Cuaderno cuaderno = cuadernoRepository.findById(dto.getIdCuaderno())
                .orElseThrow(() -> new RuntimeException("Cuaderno no encontrado"));

        Usuario usuarioInteractua = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Optional<Interaccion> existente = interaccionRepository.findByCuadernoIdAndUsuarioIdAndTipoInteraccion(
                cuaderno.getId(), usuarioInteractua.getId(), dto.getTipoInteraccion()
        );

        if (existente.isPresent() && dto.getTipoInteraccion() != TipoInteraccion.VISTA) {
            interaccionRepository.delete(existente.get());
            statsCuadernoService.actualizarPorInteraccion(cuaderno.getId(), dto.getTipoInteraccion(), false);
            statsUsuarioService.actualizarPorInteraccion(cuaderno.getUsuario().getId(), dto.getTipoInteraccion(), false);
            return null;
        }

        Interaccion interaccion = fabricaInteraccionService.crearInteraccion(dto, cuaderno, usuarioInteractua);
        interaccion = interaccionRepository.save(interaccion);

        notificacionService.generarDesdeInteraccion(interaccion);
        statsCuadernoService.actualizarPorInteraccion(cuaderno.getId(), interaccion.getTipoInteraccion(), true);
        statsUsuarioService.actualizarPorInteraccion(cuaderno.getUsuario().getId(), interaccion.getTipoInteraccion(), true);

        return new InteraccionDTO(interaccion);
    }

    // --- GET ---

    @Transactional(readOnly = true)
    public List<InteraccionDTO> listarPorCuaderno(UUID idCuaderno) {
        return interaccionRepository.findByCuadernoId(idCuaderno).stream()
                .map(InteraccionDTO::new)
                .collect(Collectors.toList());
    }
}
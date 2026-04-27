package com.hanechi.api.modules.social.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hanechi.api.modules.social.dto.RelacionDTO;
import com.hanechi.api.modules.social.model.Relacion;
import com.hanechi.api.modules.social.model.keys.ClaveRelacion;
import com.hanechi.api.modules.social.repository.RelacionRepository;
import com.hanechi.api.modules.stats.service.EstadisticasUsuarioService;
import com.hanechi.api.modules.user.model.Usuario;
import com.hanechi.api.modules.user.repository.UsuarioRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class RelacionService {
    private final RelacionRepository relacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final FabricaRelacionService fabricaRelacionService;
    private final EstadisticasUsuarioService statsUsuarioService;
    private final NotificacionService notificacionService;

    public RelacionService(RelacionRepository relacionRepository, UsuarioRepository usuarioRepository, FabricaRelacionService fabricaRelacionService, EstadisticasUsuarioService statsUsuarioService, NotificacionService notificacionService) {
        this.relacionRepository = relacionRepository;
        this.usuarioRepository = usuarioRepository;
        this.fabricaRelacionService = fabricaRelacionService;
        this.statsUsuarioService = statsUsuarioService;
        this.notificacionService = notificacionService;
    }

    // --- POST ---

    @Transactional
    public RelacionDTO crearRelacion(RelacionDTO dto) {
        Usuario emisor = usuarioRepository.findById(dto.getIdEmisor())
                .orElseThrow(() -> new EntityNotFoundException("Emisor no encontrado"));

        Usuario receptor = usuarioRepository.findById(dto.getIdReceptor())
                .orElseThrow(() -> new EntityNotFoundException("Receptor no encontrado"));

        if (emisor.getId().equals(receptor.getId())) {
            throw new RuntimeException("No puedes seguirte a ti mismo");
        }

        Relacion nuevaRelacion = fabricaRelacionService.crearRelacion(emisor, receptor);
        nuevaRelacion = relacionRepository.save(nuevaRelacion);

        statsUsuarioService.actualizarContadoresRelacion(emisor.getId(), receptor.getId(), true);
        notificacionService.generarNotificacionSeguimiento(emisor, receptor);

        return new RelacionDTO(nuevaRelacion);
    }

    // --- GET ---

    @Transactional(readOnly = true)
    public List<RelacionDTO> listarSeguidores(UUID idUsuario) {
        return relacionRepository.findSeguidoresActivos(idUsuario).stream()
                .map(RelacionDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RelacionDTO> listarSiguiendo(UUID idUsuario) {
        return relacionRepository.findSiguiendoActivos(idUsuario).stream()
                .map(RelacionDTO::new)
                .collect(Collectors.toList());
    }

    // --- DELETE ---

    @Transactional
    public void eliminarRelacion(UUID idEmisor, UUID idReceptor) {
        ClaveRelacion clave = new ClaveRelacion(idEmisor, idReceptor);
        if (!relacionRepository.existsById(clave)) {
            throw new EntityNotFoundException("La relacion no existe");
        }

        relacionRepository.deleteById(clave);

        statsUsuarioService.actualizarContadoresRelacion(idEmisor, idReceptor, false);
    }
}
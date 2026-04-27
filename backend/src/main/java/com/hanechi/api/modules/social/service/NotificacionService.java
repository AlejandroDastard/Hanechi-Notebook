package com.hanechi.api.modules.social.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hanechi.api.modules.social.dto.NotificacionDTO;
import com.hanechi.api.modules.social.enums.TipoNotificacion;
import com.hanechi.api.modules.social.enums.TipoReferencia;
import com.hanechi.api.modules.social.model.Interaccion;
import com.hanechi.api.modules.social.model.Notificacion;
import com.hanechi.api.modules.social.repository.NotificacionRepository;
import com.hanechi.api.modules.user.model.Usuario;
import com.hanechi.api.modules.user.repository.UsuarioRepository;

@Service
public class NotificacionService {
    private final NotificacionRepository notificacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final FabricaNotificacionService fabricaNotificacionService;

    public NotificacionService(NotificacionRepository notificacionRepository, UsuarioRepository usuarioRepository, FabricaNotificacionService fabricaNotificacionService) {
        this.notificacionRepository = notificacionRepository;
        this.usuarioRepository = usuarioRepository;
        this.fabricaNotificacionService = fabricaNotificacionService;
    }

    @Transactional
    public void generarDesdeInteraccion(Interaccion interaccion) {
        Usuario emisor = interaccion.getUsuario();
        Usuario receptor = interaccion.getCuaderno().getUsuario();

        if (emisor.getId().equals(receptor.getId())) {
            return;
        }

        Notificacion notificacion = new Notificacion();
        notificacion.setEmisor(emisor);
        notificacion.setReceptor(receptor);
        notificacion.setIdReferencia(interaccion.getCuaderno().getId());
        notificacion.setTipoReferencia(TipoReferencia.CUADERNO);

        switch (interaccion.getTipoInteraccion()) {
            case LIKE -> notificacion.setTipoNotificacion(TipoNotificacion.LIKE);
            case GUARDADO -> notificacion.setTipoNotificacion(TipoNotificacion.GUARDADO);
            case VISTA -> notificacion.setTipoNotificacion(TipoNotificacion.VISTA);
        }

        notificacionRepository.save(notificacion);
    }

    @Transactional
    public void generarNotificacionSeguimiento(Usuario emisor, Usuario receptor) {
        Notificacion notificacion = new Notificacion();
        notificacion.setEmisor(emisor);
        notificacion.setReceptor(receptor);
        notificacion.setIdReferencia(emisor.getId());
        notificacion.setTipoReferencia(TipoReferencia.USUARIO);
        notificacion.setTipoNotificacion(TipoNotificacion.FOLLOW);

        notificacionRepository.save(notificacion);
    }

    @Transactional(readOnly = true)
    public List<NotificacionDTO> listarPorUsuario(UUID idReceptor) {
        return notificacionRepository.findByReceptorId(idReceptor).stream()
                .map(NotificacionDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public NotificacionDTO crearNotificacion(NotificacionDTO dto) {
        Usuario emisor = usuarioRepository.findById(dto.getIdEmisor()).orElseThrow();
        Usuario receptor = usuarioRepository.findById(dto.getIdReceptor()).orElseThrow();
        Notificacion notificacion = fabricaNotificacionService.crearNotificacion(dto, emisor, receptor);
        return new NotificacionDTO(notificacionRepository.save(notificacion));
    }
}
package com.hanechi.api.modules.social.service;

import org.springframework.stereotype.Service;

import com.hanechi.api.modules.social.dto.NotificacionDTO;
import com.hanechi.api.modules.social.model.Notificacion;
import com.hanechi.api.modules.user.model.Usuario;

@Service
public class FabricaNotificacionService {

    public Notificacion crearNotificacion(NotificacionDTO dto, Usuario emisor, Usuario receptor) {
        Notificacion notificacion = new Notificacion();
        
        notificacion.setEmisor(emisor);
        notificacion.setReceptor(receptor);
        notificacion.setIdReferencia(dto.getIdReferencia());
        notificacion.setTipoReferencia(dto.getTipoReferencia());
        notificacion.setTipoNotificacion(dto.getTipoNotificacion());

        return notificacion;
    }
}

package com.hanechi.api.modules.social.service;

import java.time.ZonedDateTime;

import org.springframework.stereotype.Service;

import com.hanechi.api.modules.social.model.Relacion;
import com.hanechi.api.modules.social.model.keys.ClaveRelacion;
import com.hanechi.api.modules.user.model.Usuario;

@Service
public class FabricaRelacionService {

    public Relacion crearRelacion(Usuario emisor, Usuario receptor) {
        Relacion relacion = new Relacion();
        
        relacion.setId(new ClaveRelacion(emisor.getId(), receptor.getId()));
        relacion.setEmisor(emisor);
        relacion.setReceptor(receptor);
        relacion.setFechaInteraccion(ZonedDateTime.now());

        return relacion;
    }
}

package com.hanechi.api.modules.social.service;

import java.time.ZonedDateTime;

import org.springframework.stereotype.Service;

import com.hanechi.api.modules.content.model.Cuaderno;
import com.hanechi.api.modules.social.dto.InteraccionDTO;
import com.hanechi.api.modules.social.model.Interaccion;
import com.hanechi.api.modules.user.model.Usuario;

@Service
public class FabricaInteraccionService {
    public Interaccion crearInteraccion(InteraccionDTO dto, Cuaderno cuaderno, Usuario usuario) {
        Interaccion interaccion = new Interaccion();
        
        interaccion.setCuaderno(cuaderno);
        interaccion.setUsuario(usuario);
        interaccion.setTipoInteraccion(dto.getTipoInteraccion());
        interaccion.setFechaInteraccion(dto.getFechaInteraccion() != null 
            ? dto.getFechaInteraccion() 
            : ZonedDateTime.now());
                
        return interaccion;
    }
}
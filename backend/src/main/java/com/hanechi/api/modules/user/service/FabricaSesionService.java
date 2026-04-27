package com.hanechi.api.modules.user.service;

import java.time.ZonedDateTime;

import org.springframework.stereotype.Service;

import com.hanechi.api.modules.user.model.Sesion;
import com.hanechi.api.modules.user.model.Usuario;

@Service
public class FabricaSesionService {
    public Sesion crearSesion(Usuario usuario, String dispositivo, int diasExpiracion) {
        Sesion sesion = new Sesion();
        sesion.setUsuario(usuario);
        sesion.setDispositivo(dispositivo != null ? dispositivo : "Desconocido");
        sesion.setFechaInicio(ZonedDateTime.now());
        sesion.setFechaExpiracion(ZonedDateTime.now().plusDays(diasExpiracion));
        
        return sesion;
    }
}
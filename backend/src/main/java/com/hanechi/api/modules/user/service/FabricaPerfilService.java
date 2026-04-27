package com.hanechi.api.modules.user.service;

import org.springframework.stereotype.Service;

import com.hanechi.api.modules.user.model.Perfil;
import com.hanechi.api.modules.user.model.Usuario;

@Service
public class FabricaPerfilService {
    public Perfil crearPerfilBase(Usuario usuario) {
        if (usuario == null) {
            throw new IllegalArgumentException("El usuario no puede ser nulo");
        }

        Perfil perfil = new Perfil();
        perfil.setUsuario(usuario);
        perfil.setId(usuario.getId());
        perfil.setNombrePerfil(usuario.getNombreUsuario());
        perfil.setUrlAvatar("default_avatar.png");
        perfil.setUrlBanner("default_banner.png");
        perfil.setBibliografia("");

        return perfil;
    }
}
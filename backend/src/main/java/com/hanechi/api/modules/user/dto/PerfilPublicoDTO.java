package com.hanechi.api.modules.user.dto;

import java.util.UUID;

import com.hanechi.api.modules.user.model.Perfil;
import com.hanechi.api.modules.user.model.Usuario;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PerfilPublicoDTO {

    private UUID idUsuario;
    private String nombreUsuario;
    private String nombrePerfil;
    private String urlAvatar;
    private String urlBanner;
    private String bibliografia;

    public PerfilPublicoDTO(Perfil entity) {
        if (entity != null) {
            this.idUsuario = entity.getId();
            this.nombrePerfil = entity.getNombrePerfil();
            this.urlAvatar = entity.getUrlAvatar();
            this.urlBanner = entity.getUrlBanner();
            this.bibliografia = entity.getBibliografia();

            if (entity.getUsuario() != null) {
                this.nombreUsuario = entity.getUsuario().getNombreUsuario();
            }
        }
    }

    public static PerfilPublicoDTO fromEntity(Usuario usuario) {
        if (usuario == null || usuario.getPerfil() == null) {
            return null;
        }
        return new PerfilPublicoDTO(usuario.getPerfil());
    }
}
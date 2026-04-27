package com.hanechi.api.modules.user.dto;

import java.util.UUID;

import com.hanechi.api.modules.user.model.Perfil;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PerfilDTO {
    private UUID idUsuario;
    private String nombrePerfil;
    private String urlAvatar;
    private String urlBanner;
    private String bibliografia;

    public PerfilDTO(Perfil entity) {
        if (entity != null) {
            this.idUsuario = entity.getId();
            this.nombrePerfil = entity.getNombrePerfil();
            this.urlAvatar = entity.getUrlAvatar();
            this.urlBanner = entity.getUrlBanner();
            this.bibliografia = entity.getBibliografia();
        }
    }
}

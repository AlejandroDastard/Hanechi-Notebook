package com.hanechi.api.modules.user.dto;

import lombok.Data;

@Data
public class ActualizacionPerfilDTO {
    private String nombrePerfil;
    private String urlAvatar;
    private String urlBanner;
    private String bibliografia;
}

package com.hanechi.api.modules.user.dto;

import lombok.Data;

@Data
public class CambioContrasenaDTO {
    private String contrasenaActual;
    private String contrasenaNueva;
}

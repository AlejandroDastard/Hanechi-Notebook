package com.hanechi.api.modules.user.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class InicioSesionDTO {
    private String correo;
    private String contrasena;
}
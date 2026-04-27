package com.hanechi.api.modules.user.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CodigoVerificacionDTO {
    private String correo;
    private String codigo;
}
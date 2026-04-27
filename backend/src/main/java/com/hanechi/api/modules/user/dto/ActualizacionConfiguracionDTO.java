package com.hanechi.api.modules.user.dto;

import com.hanechi.api.modules.user.enums.NivelNotificacion;
import com.hanechi.api.modules.user.enums.PreferenciaContenido;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ActualizacionConfiguracionDTO {
    private Boolean perfilPublico;
    private Boolean mostrarEstadisticas;
    private String tema;
    private String idioma;
    private NivelNotificacion nivelNotificacion;
    private PreferenciaContenido preferenciaContenido;
    private Boolean autoguardadoActivo;
}
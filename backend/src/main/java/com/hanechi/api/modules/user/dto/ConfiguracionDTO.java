package com.hanechi.api.modules.user.dto;

import java.util.UUID;

import com.hanechi.api.modules.user.enums.NivelNotificacion;
import com.hanechi.api.modules.user.enums.PreferenciaContenido;
import com.hanechi.api.modules.user.model.Configuracion;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ConfiguracionDTO {
    private UUID id;
    private Boolean perfilPublico;
    private Boolean mostrarEstadisticas;
    private String tema;
    private String idioma;
    private NivelNotificacion nivelNotificacion;
    private PreferenciaContenido preferenciaContenido;
    private Boolean autoguardadoActivo;

    public ConfiguracionDTO(Configuracion entity) {
        if (entity != null) {
            this.id = entity.getId();
            this.perfilPublico = entity.getPerfilPublico();
            this.mostrarEstadisticas = entity.getMostrarEstadisticas();
            this.tema = entity.getTema();
            this.idioma = entity.getIdioma();
            this.nivelNotificacion = entity.getNivelNotificacion();
            this.preferenciaContenido = entity.getPreferenciaContenido();
            this.autoguardadoActivo = entity.getAutoguardadoActivo();
        }
    }
}
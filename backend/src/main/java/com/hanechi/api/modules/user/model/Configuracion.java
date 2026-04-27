package com.hanechi.api.modules.user.model;

import java.util.UUID;

import com.hanechi.api.modules.user.dto.ConfiguracionDTO;
import com.hanechi.api.modules.user.enums.NivelNotificacion;
import com.hanechi.api.modules.user.enums.PreferenciaContenido;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "configuracion")
@Data
@NoArgsConstructor
public class Configuracion {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_configuracion")
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "perfil_publico")
    private Boolean perfilPublico;

    @Column(name = "mostrar_estadisticas")
    private Boolean mostrarEstadisticas;

    @Column(name = "tema")
    private String tema;

    @Column(name = "idioma")
    private String idioma;

    @Enumerated(EnumType.STRING)
    @Column(name = "nivel_notificacion")
    private NivelNotificacion nivelNotificacion;

    @Enumerated(EnumType.STRING)
    @Column(name = "preferencia_contenido")
    private PreferenciaContenido preferenciaContenido;

    @Column(name = "autoguardado_activo")
    private Boolean autoguardadoActivo;

    public Configuracion(ConfiguracionDTO dto) {
        if (dto != null) {
            this.id = dto.getId();
            this.perfilPublico = dto.getPerfilPublico();
            this.mostrarEstadisticas = dto.getMostrarEstadisticas();
            this.tema = dto.getTema();
            this.idioma = dto.getIdioma();
            this.nivelNotificacion = dto.getNivelNotificacion();
            this.preferenciaContenido = dto.getPreferenciaContenido();
            this.autoguardadoActivo = dto.getAutoguardadoActivo();
        }
    }
}
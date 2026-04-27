package com.hanechi.api.modules.user.model;

import java.util.UUID;

import com.hanechi.api.modules.user.dto.PerfilDTO;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "perfil")
@Data
@NoArgsConstructor
public class Perfil {
    @Id
    @Column(name = "id_usuario")
    private UUID id;

    @Column(name = "nombre_perfil", nullable = false)
    private String nombrePerfil;

    @Column(name = "url_avatar")
    private String urlAvatar;

    @Column(name = "url_banner")
    private String urlBanner;

    @Column(name = "bibliografia")
    private String bibliografia;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    public Perfil(PerfilDTO dto) {
        if (dto != null) {
            this.id = dto.getIdUsuario();
            this.nombrePerfil = dto.getNombrePerfil();
            this.urlAvatar = dto.getUrlAvatar();
            this.urlBanner = dto.getUrlBanner();
            this.bibliografia = dto.getBibliografia();
        }
    }
}

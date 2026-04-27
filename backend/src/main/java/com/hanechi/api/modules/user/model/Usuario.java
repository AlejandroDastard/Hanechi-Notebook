package com.hanechi.api.modules.user.model;

import com.hanechi.api.modules.stats.model.EstadisticasUsuario;
import com.hanechi.api.modules.user.dto.UsuarioDTO;
import com.hanechi.api.modules.user.enums.EstadoUsuario;
import com.hanechi.api.modules.user.enums.RolUsuario;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "usuario")
@Data
@NoArgsConstructor
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_usuario")
    private UUID id;

    @Column(name = "nombre_usuario", nullable = false, length = 30)
    private String nombreUsuario;

    @Column(nullable = false, unique = true)
    private String correo;

    @Column
    private String contrasena;

    @Column
    private Integer telefono;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Configuracion configuracion;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_usuario", nullable = false)
    private EstadoUsuario estadoUsuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RolUsuario rol;

    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    @Column(name = "fecha_registro", nullable = false)
    private ZonedDateTime fechaRegistro;

    @Column(name = "fecha_eliminacion")
    private ZonedDateTime fechaEliminacion;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Perfil perfil;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private EstadisticasUsuario estadisticas;

    public Usuario(UsuarioDTO dto) {
        if (dto != null) {
            this.id = dto.getId();
            this.nombreUsuario = dto.getNombreUsuario();
            this.correo = dto.getCorreo();
            this.telefono = dto.getTelefono();
            this.estadoUsuario = dto.getEstadoUsuario();
            this.rol = dto.getRol();
            this.fechaNacimiento = dto.getFechaNacimiento();
            this.fechaRegistro = ZonedDateTime.now();
            
            if (dto.getConfiguracion() != null) {
                this.configuracion = new Configuracion(dto.getConfiguracion());
                this.configuracion.setUsuario(this);
            }

            if (dto.getPerfil() != null) {
                this.perfil = new Perfil(dto.getPerfil());
                this.perfil.setUsuario(this);
            }
        }
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + (rol != null ? rol.name() : "USER")));
    }

    @Override
    public String getPassword() {
        return contrasena;
    }

    @Override
    public String getUsername() {
        return correo;
    }

    @Override
    public boolean isEnabled() {
        return estadoUsuario == EstadoUsuario.ACTIVO;
    }
}
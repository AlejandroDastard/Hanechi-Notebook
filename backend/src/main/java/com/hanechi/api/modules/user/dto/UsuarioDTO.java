package com.hanechi.api.modules.user.dto;

import java.time.LocalDate;
import java.util.UUID;

import com.hanechi.api.modules.user.enums.EstadoUsuario;
import com.hanechi.api.modules.user.enums.RolUsuario;
import com.hanechi.api.modules.user.model.Usuario;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UsuarioDTO {
    private UUID id;
    private String nombreUsuario;
    private String correo;
    private Integer telefono;
    private EstadoUsuario estadoUsuario;
    private RolUsuario rol;
    private LocalDate fechaNacimiento;
    private ConfiguracionDTO configuracion;
    private PerfilDTO perfil;

    public UsuarioDTO(Usuario entity) {
        if (entity != null) {
            this.id = entity.getId();
            this.nombreUsuario = entity.getNombreUsuario();
            this.correo = entity.getCorreo();
            this.telefono = entity.getTelefono();
            this.estadoUsuario = entity.getEstadoUsuario();
            this.rol = entity.getRol();
            this.fechaNacimiento = entity.getFechaNacimiento();
            
            if (entity.getConfiguracion() != null) {
                this.configuracion = new ConfiguracionDTO(entity.getConfiguracion());
            }
            
            if (entity.getPerfil() != null) {
                this.perfil = new PerfilDTO(entity.getPerfil());
            }
        }
    }
}
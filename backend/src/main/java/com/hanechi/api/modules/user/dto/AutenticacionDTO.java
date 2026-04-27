package com.hanechi.api.modules.user.dto;

import java.util.UUID;

import com.hanechi.api.modules.user.enums.RolUsuario;
import com.hanechi.api.modules.user.model.Usuario;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AutenticacionDTO {

    private String token;
    private String tipoToken = "Bearer";
    
    private UUID usuarioId;
    private String nombreUsuario;
    private RolUsuario rol;

    public void cargarDatosUsuario(Usuario usuario) {
        if (usuario != null) {
            this.usuarioId = usuario.getId();
            this.nombreUsuario = usuario.getNombreUsuario();
            this.rol = usuario.getRol();
        }
    }
}
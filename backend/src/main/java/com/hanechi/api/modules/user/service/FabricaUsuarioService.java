package com.hanechi.api.modules.user.service;

import java.time.ZonedDateTime;

import org.springframework.stereotype.Service;

import com.hanechi.api.modules.stats.service.FabricaEstadisticasUsuarioService;
import com.hanechi.api.modules.user.dto.RegistroDTO;
import com.hanechi.api.modules.user.dto.UsuarioDTO;
import com.hanechi.api.modules.user.enums.EstadoUsuario;
import com.hanechi.api.modules.user.enums.RolUsuario;
import com.hanechi.api.modules.user.model.Usuario;

@Service
public class FabricaUsuarioService {
    private final FabricaConfiguracionService fabricaConfiguracion;
    private final FabricaPerfilService fabricaPerfil;
    private final FabricaEstadisticasUsuarioService fabricaEstadisticas;

    public FabricaUsuarioService(FabricaConfiguracionService fabricaConfiguracion, FabricaPerfilService fabricaPerfil, FabricaEstadisticasUsuarioService fabricaEstadisticas) {
        this.fabricaConfiguracion = fabricaConfiguracion;
        this.fabricaPerfil = fabricaPerfil;
        this.fabricaEstadisticas = fabricaEstadisticas;
    }

    public UsuarioDTO crearDTO(Usuario usuario) {
        return new UsuarioDTO(usuario);
    }

    public Usuario crearDesdeRegistro(RegistroDTO dto, String contrasenaCifrada) {
        Usuario usuario = new Usuario();
        usuario.setNombreUsuario(dto.getNombreUsuario().toLowerCase().trim());
        usuario.setCorreo(dto.getCorreo().toLowerCase().trim());
        usuario.setContrasena(contrasenaCifrada);
        usuario.setFechaNacimiento(dto.getFechaNacimiento());
        usuario.setEstadoUsuario(EstadoUsuario.PENDIENTE);
        usuario.setFechaRegistro(ZonedDateTime.now());
        usuario.setRol(RolUsuario.USER);

        usuario.setConfiguracion(fabricaConfiguracion.crearConfiguracionBase(usuario));
        usuario.setPerfil(fabricaPerfil.crearPerfilBase(usuario));
        usuario.setEstadisticas(fabricaEstadisticas.crearEstadisticasBase(usuario));
        
        return usuario;
    }
}
package com.hanechi.api.modules.user.service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hanechi.api.modules.user.dto.CambioContrasenaDTO;
import com.hanechi.api.modules.user.dto.CambioNombreDTO;
import com.hanechi.api.modules.user.dto.UsuarioDTO;
import com.hanechi.api.modules.user.enums.EstadoUsuario;
import com.hanechi.api.modules.user.model.Usuario;
import com.hanechi.api.modules.user.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final FabricaUsuarioService fabricaUsuario;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, FabricaUsuarioService fabricaUsuario, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.fabricaUsuario = fabricaUsuario;
        this.passwordEncoder = passwordEncoder;
    }

    // --- GET ---

    @Transactional(readOnly = true)
    public List<UsuarioDTO> listarTodos() {
        return usuarioRepository.findAll().stream()
            .map(fabricaUsuario::crearDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UsuarioDTO obtenerPorId(UUID id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        return fabricaUsuario.crearDTO(usuario);
    }

    // --- ACTUALIZACIÓN ---

    @Transactional
    public void cambiarContrasena(UUID id, CambioContrasenaDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(dto.getContrasenaActual(), usuario.getContrasena())) {
            throw new RuntimeException("Contrasena actual incorrecta");
        }

        usuario.setContrasena(passwordEncoder.encode(dto.getContrasenaNueva()));
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void cambiarNombre(UUID id, CambioNombreDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String nombreLimpio = dto.getNuevoNombre().toLowerCase().trim();

        if (usuarioRepository.existsByNombreUsuario(nombreLimpio)) {
            throw new RuntimeException("El nombre de usuario ya esta en uso");
        }

        usuario.setNombreUsuario(nombreLimpio);
        usuarioRepository.save(usuario);
    }

    // --- ELIMINACIÓN ---

    @Transactional
    public void eliminar(UUID id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
        usuario.setEstadoUsuario(EstadoUsuario.BORRADO);
        usuario.setFechaEliminacion(ZonedDateTime.now());
        usuarioRepository.save(usuario);
    }
}
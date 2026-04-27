package com.hanechi.api.modules.user.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hanechi.api.modules.user.dto.SesionDTO;
import com.hanechi.api.modules.user.model.Sesion;
import com.hanechi.api.modules.user.model.Usuario;
import com.hanechi.api.modules.user.repository.SesionRepository;
import com.hanechi.api.modules.user.repository.UsuarioRepository;

@Service
public class SesionService {
    private final SesionRepository sesionRepository;
    private final UsuarioRepository usuarioRepository;
    private final FabricaSesionService fabricaSesionService;

    public SesionService(SesionRepository sesionRepository, UsuarioRepository usuarioRepository, FabricaSesionService fabricaSesionService) {
        this.sesionRepository = sesionRepository;
        this.usuarioRepository = usuarioRepository;
        this.fabricaSesionService = fabricaSesionService;
    }

    // --- POST ---

    @Transactional
    public SesionDTO crearSesion(SesionDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Sesion nuevaSesion = fabricaSesionService.crearSesion(usuario, dto.getDispositivo(), 30);

        return new SesionDTO(sesionRepository.save(nuevaSesion));
    }

    // --- GET ---

    @Transactional(readOnly = true)
    public List<SesionDTO> listarSesionesUsuario(UUID idUsuario) {
        return sesionRepository.findByUsuarioId(idUsuario).stream()
            .map(SesionDTO::new)
            .collect(Collectors.toList());
    }

    // --- DELETE ---

    @Transactional
    public void cerrarSesion(UUID idSesion) {
        sesionRepository.deleteById(idSesion);
    }
}
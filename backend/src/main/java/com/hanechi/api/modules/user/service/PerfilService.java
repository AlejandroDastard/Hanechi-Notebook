package com.hanechi.api.modules.user.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hanechi.api.modules.user.dto.ActualizacionPerfilDTO;
import com.hanechi.api.modules.user.dto.PerfilDTO;
import com.hanechi.api.modules.user.dto.PerfilPublicoDTO;
import com.hanechi.api.modules.user.model.Perfil;
import com.hanechi.api.modules.user.repository.PerfilRepository;

@Service
public class PerfilService {
    private final PerfilRepository perfilRepository;

    public PerfilService(PerfilRepository perfilRepository) {
        this.perfilRepository = perfilRepository;
    }

    // --- GET ---

    @Transactional(readOnly = true)
    public List<PerfilPublicoDTO> buscarPorNombre(String nombre) {
        return perfilRepository.buscarPerfilesPublicos(nombre).stream()
            .map(PerfilPublicoDTO::new)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PerfilDTO obtenerPerfil(UUID idUsuario) {
        Perfil perfil = perfilRepository.findById(idUsuario)
            .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));

        return new PerfilDTO(perfil);
    }

    @Transactional(readOnly = true)
    public PerfilPublicoDTO obtenerPerfilPublico(UUID idUsuario) {
        Perfil perfil = perfilRepository.findById(idUsuario)
            .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));

        return new PerfilPublicoDTO(perfil);
    }

    // --- PATCH ---

    @Transactional
    public PerfilDTO actualizarPerfil(UUID idUsuario, ActualizacionPerfilDTO dto) {
        Perfil perfil = perfilRepository.findById(idUsuario)
            .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));

        if (dto.getNombrePerfil() != null)
            perfil.setNombrePerfil(dto.getNombrePerfil());
        if (dto.getUrlAvatar() != null)
            perfil.setUrlAvatar(dto.getUrlAvatar());
        if (dto.getUrlBanner() != null)
            perfil.setUrlBanner(dto.getUrlBanner());
        if (dto.getBibliografia() != null)
            perfil.setBibliografia(dto.getBibliografia());

        return new PerfilDTO(perfilRepository.save(perfil));
    }
}
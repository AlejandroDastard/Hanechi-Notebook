package com.hanechi.api.modules.user.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hanechi.api.modules.user.dto.ActualizacionPerfilDTO;
import com.hanechi.api.modules.user.dto.PerfilDTO;
import com.hanechi.api.modules.user.dto.PerfilPublicoDTO;
import com.hanechi.api.modules.user.service.PerfilService;

@RestController
@RequestMapping("/api/perfiles")
public class PerfilController {
    private final PerfilService perfilService;

    public PerfilController(PerfilService perfilService) {
        this.perfilService = perfilService;
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<PerfilPublicoDTO>> buscarPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(perfilService.buscarPorNombre(nombre));
    }

    @GetMapping("/{idUsuario}")
    public ResponseEntity<PerfilDTO> obtenerPerfil(@PathVariable UUID idUsuario) {
        return ResponseEntity.ok(perfilService.obtenerPerfil(idUsuario));
    }

    @GetMapping("/{idUsuario}/publico")
    public ResponseEntity<PerfilPublicoDTO> obtenerPerfilPublico(@PathVariable UUID idUsuario) {
        return ResponseEntity.ok(perfilService.obtenerPerfilPublico(idUsuario));
    }

    @PatchMapping("/{idUsuario}")
    public ResponseEntity<PerfilDTO> actualizarPerfil(@PathVariable UUID idUsuario, @RequestBody ActualizacionPerfilDTO dto) {
        return ResponseEntity.ok(perfilService.actualizarPerfil(idUsuario, dto));
    }
}
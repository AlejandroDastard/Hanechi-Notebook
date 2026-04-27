package com.hanechi.api.modules.user.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hanechi.api.modules.user.dto.ActualizacionConfiguracionDTO;
import com.hanechi.api.modules.user.dto.ConfiguracionDTO;
import com.hanechi.api.modules.user.service.ConfiguracionService;

@RestController
@RequestMapping("/api/configuraciones")
public class ConfiguracionController {
    private final ConfiguracionService configuracionService;

    public ConfiguracionController(ConfiguracionService configuracionService) {
        this.configuracionService = configuracionService;
    }

    @GetMapping("/{usuarioId}")
    public ResponseEntity<ConfiguracionDTO> obtenerPorUsuarioId(@PathVariable UUID usuarioId) {
        return ResponseEntity.ok(configuracionService.obtenerPorUsuarioId(usuarioId));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ConfiguracionDTO> actualizar(@PathVariable UUID id, @RequestBody ActualizacionConfiguracionDTO dto) {
        return ResponseEntity.ok(configuracionService.actualizar(id, dto));
    }
}
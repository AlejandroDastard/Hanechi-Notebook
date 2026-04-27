package com.hanechi.api.modules.stats.controller;

import java.util.UUID;

import com.hanechi.api.modules.stats.model.EstadisticasUsuario;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hanechi.api.modules.stats.dto.EstadisticasUsuarioDTO;
import com.hanechi.api.modules.stats.service.EstadisticasUsuarioService;

@RestController
@RequestMapping("/api/estadisticas/usuarios")
public class EstadisticasUsuarioController {
    private final EstadisticasUsuarioService estadisticasService;

    public EstadisticasUsuarioController(EstadisticasUsuarioService estadisticasService) {
        this.estadisticasService = estadisticasService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstadisticasUsuarioDTO> obtener(@PathVariable UUID id) {
        EstadisticasUsuario entidad = estadisticasService.obtenerEstadisticas(id);
        EstadisticasUsuarioDTO dto = new EstadisticasUsuarioDTO(entidad);
        return ResponseEntity.ok(dto);
    }
}

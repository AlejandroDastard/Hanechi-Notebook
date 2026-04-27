package com.hanechi.api.modules.stats.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hanechi.api.modules.stats.dto.EstadisticasCuadernoDTO;
import com.hanechi.api.modules.stats.service.EstadisticasCuadernoService;

@RestController
@RequestMapping("/api/estadisticas/cuadernos")
public class EstadisticasCuadernoController {
    private final EstadisticasCuadernoService estadisticasService;

    public EstadisticasCuadernoController(EstadisticasCuadernoService estadisticasService) {
        this.estadisticasService = estadisticasService;
    }

    @GetMapping("/{idCuaderno}")
    public ResponseEntity<EstadisticasCuadernoDTO> obtenerEstadisticas(@PathVariable UUID idCuaderno) {
        return ResponseEntity.ok(estadisticasService.obtenerEstadisticas(idCuaderno));
    }
}
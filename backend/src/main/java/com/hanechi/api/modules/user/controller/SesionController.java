package com.hanechi.api.modules.user.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hanechi.api.modules.user.dto.SesionDTO;
import com.hanechi.api.modules.user.service.SesionService;

@RestController
@RequestMapping("/api/sesiones")
public class SesionController {

    private final SesionService sesionService;

    public SesionController(SesionService sesionService) {
        this.sesionService = sesionService;
    }

    @PostMapping
    public ResponseEntity<SesionDTO> crearSesion(@RequestBody SesionDTO dto) {
        return ResponseEntity.ok(sesionService.crearSesion(dto));
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<SesionDTO>> getSesionesPorUsuario(@PathVariable UUID idUsuario) {
        return ResponseEntity.ok(sesionService.listarSesionesUsuario(idUsuario));
    }

    @DeleteMapping("/{idSesion}")
    public ResponseEntity<Void> cerrarSesion(@PathVariable UUID idSesion) {
        sesionService.cerrarSesion(idSesion);
        return ResponseEntity.noContent().build();
    }
}
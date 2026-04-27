package com.hanechi.api.modules.social.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hanechi.api.modules.social.dto.RelacionDTO;
import com.hanechi.api.modules.social.service.RelacionService;

@RestController
@RequestMapping("/api/relaciones")
public class RelacionController {
    private final RelacionService relacionService;

    public RelacionController(RelacionService relacionService) {
        this.relacionService = relacionService;
    }

    @PostMapping
    public ResponseEntity<RelacionDTO> crearRelacion(@RequestBody RelacionDTO dto) {
        return ResponseEntity.ok(relacionService.crearRelacion(dto));
    }

    @GetMapping("/seguidores/{idUsuario}")
    public ResponseEntity<List<RelacionDTO>> obtenerSeguidores(@PathVariable UUID idUsuario) {
        return ResponseEntity.ok(relacionService.listarSeguidores(idUsuario));
    }

    @GetMapping("/siguiendo/{idUsuario}")
    public ResponseEntity<List<RelacionDTO>> obtenerSiguiendo(@PathVariable UUID idUsuario) {
        return ResponseEntity.ok(relacionService.listarSiguiendo(idUsuario));
    }

    @DeleteMapping("/{idEmisor}/{idReceptor}")
    public ResponseEntity<Void> eliminarRelacion(@PathVariable UUID idEmisor, @PathVariable UUID idReceptor) {
        relacionService.eliminarRelacion(idEmisor, idReceptor);
        return ResponseEntity.noContent().build();
    }
}
package com.hanechi.api.modules.social.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hanechi.api.modules.social.dto.InteraccionDTO;
import com.hanechi.api.modules.social.service.InteraccionService;

@RestController
@RequestMapping("/api/interacciones")
public class InteraccionController {
    private final InteraccionService interaccionService;

    public InteraccionController(InteraccionService interaccionService) {
        this.interaccionService = interaccionService;
    }

    @PostMapping
    public ResponseEntity<InteraccionDTO> registrarInteraccion(@RequestBody InteraccionDTO dto) {
        return ResponseEntity.ok(interaccionService.registrarInteraccion(dto));
    }

    @GetMapping("/cuaderno/{idCuaderno}")
    public ResponseEntity<List<InteraccionDTO>> listarPorCuaderno(@PathVariable UUID idCuaderno) {
        return ResponseEntity.ok(interaccionService.listarPorCuaderno(idCuaderno));
    }
}
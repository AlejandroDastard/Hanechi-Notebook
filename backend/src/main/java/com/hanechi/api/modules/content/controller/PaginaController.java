package com.hanechi.api.modules.content.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hanechi.api.modules.content.dto.PaginaDTO;
import com.hanechi.api.modules.content.dto.PeticionPaginaDTO;
import com.hanechi.api.modules.content.service.PaginaService;

@RestController
@RequestMapping("/api/paginas")
public class PaginaController {
    private final PaginaService paginaService;

    public PaginaController(PaginaService paginaService) {
        this.paginaService = paginaService;
    }

    @PostMapping("/cuaderno/{idCuaderno}")
    public ResponseEntity<PaginaDTO> crearPagina(@PathVariable UUID idCuaderno, @RequestBody PeticionPaginaDTO dto) {
        return ResponseEntity.ok(paginaService.crearPagina(idCuaderno, dto));
    }

    @GetMapping("/cuaderno/{idCuaderno}")
    public ResponseEntity<List<PaginaDTO>> listarPorCuaderno(@PathVariable UUID idCuaderno) {
        return ResponseEntity.ok(paginaService.listarPorCuaderno(idCuaderno));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaginaDTO> obtenerPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(paginaService.obtenerPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable UUID id) {
        paginaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
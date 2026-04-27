package com.hanechi.api.modules.content.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hanechi.api.modules.content.dto.ElementoPaginaDTO;
import com.hanechi.api.modules.content.service.ElementoPaginaService;

@RestController
@RequestMapping("/api/elementos")
public class ElementoPaginaController {
    private final ElementoPaginaService elementoService;

    public ElementoPaginaController(ElementoPaginaService elementoService) {
        this.elementoService = elementoService;
    }

    @PostMapping("/pagina/{idPagina}")
    public ResponseEntity<ElementoPaginaDTO> crearElemento(@PathVariable UUID idPagina, @RequestBody ElementoPaginaDTO dto) {
        return ResponseEntity.ok(elementoService.crearElemento(idPagina, dto));
    }

    @GetMapping("/pagina/{idPagina}")
    public ResponseEntity<List<ElementoPaginaDTO>> listarPorPagina(@PathVariable UUID idPagina) {
        return ResponseEntity.ok(elementoService.listarPorPagina(idPagina));
    }

    @PatchMapping("/pagina/{idPagina}/reordenar")
    public ResponseEntity<List<ElementoPaginaDTO>> reordenarElementos(@PathVariable UUID idPagina, @RequestParam UUID idElemento, @RequestParam Integer nuevoOrden) {
        return ResponseEntity.ok(elementoService.reordenarElemento(idPagina, idElemento, nuevoOrden));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable UUID id) {
        elementoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
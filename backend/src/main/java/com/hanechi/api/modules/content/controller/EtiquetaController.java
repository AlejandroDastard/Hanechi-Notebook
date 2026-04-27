package com.hanechi.api.modules.content.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hanechi.api.modules.content.dto.EtiquetaDTO;
import com.hanechi.api.modules.content.service.EtiquetaService;

@RestController
@RequestMapping("/api/etiquetas")
public class EtiquetaController {
    private final EtiquetaService etiquetaService;

    public EtiquetaController(EtiquetaService etiquetaService) {
        this.etiquetaService = etiquetaService;
    }

    @GetMapping
    public ResponseEntity<List<EtiquetaDTO>> listarTodas() {
        return ResponseEntity.ok(etiquetaService.listarTodas());
    }
}
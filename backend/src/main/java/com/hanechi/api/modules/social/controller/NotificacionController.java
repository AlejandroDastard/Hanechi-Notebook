package com.hanechi.api.modules.social.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hanechi.api.modules.social.dto.NotificacionDTO;
import com.hanechi.api.modules.social.service.NotificacionService;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {
    private final NotificacionService notificacionService;

    public NotificacionController(NotificacionService notificacionService) {
        this.notificacionService = notificacionService;
    }

    @PostMapping
    public ResponseEntity<NotificacionDTO> crearNotificacion(@RequestBody NotificacionDTO dto) {
        return ResponseEntity.ok(notificacionService.crearNotificacion(dto));
    }

    @GetMapping("/usuario/{idReceptor}")
    public ResponseEntity<List<NotificacionDTO>> listarPorUsuario(@PathVariable UUID idReceptor) {
        return ResponseEntity.ok(notificacionService.listarPorUsuario(idReceptor));
    }
}
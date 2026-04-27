package com.hanechi.api.modules.user.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hanechi.api.modules.user.dto.CambioContrasenaDTO;
import com.hanechi.api.modules.user.dto.CambioNombreDTO;
import com.hanechi.api.modules.user.dto.UsuarioDTO;
import com.hanechi.api.modules.user.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> getAll() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(usuarioService.obtenerPorId(id));
    }

    @PutMapping("/{id}/contrasena")
    public ResponseEntity<Void> changePassword(@PathVariable UUID id, @RequestBody CambioContrasenaDTO dto) {
        usuarioService.cambiarContrasena(id, dto);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/nombre")
    public ResponseEntity<Void> changeUsername(@PathVariable UUID id, @RequestBody CambioNombreDTO dto) {
        usuarioService.cambiarNombre(id, dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
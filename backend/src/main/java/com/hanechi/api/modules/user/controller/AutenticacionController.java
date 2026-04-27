package com.hanechi.api.modules.user.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hanechi.api.modules.user.dto.AutenticacionDTO;
import com.hanechi.api.modules.user.dto.CodigoVerificacionDTO;
import com.hanechi.api.modules.user.dto.InicioSesionDTO;
import com.hanechi.api.modules.user.dto.RegistroDTO;
import com.hanechi.api.modules.user.service.AutenticacionService;

@RestController
@RequestMapping("/api/auth")
public class AutenticacionController {

    private final AutenticacionService authService;

    public AutenticacionController(AutenticacionService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> registrar(@RequestBody RegistroDTO dto) {
        return ResponseEntity.ok(authService.signup(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<String> iniciarSesion(@RequestBody InicioSesionDTO dto) {
        return ResponseEntity.ok(authService.iniciarSesionMfa(dto));
    }

    @PostMapping("/mfa/verificar")
    public ResponseEntity<AutenticacionDTO> verificar(@RequestBody CodigoVerificacionDTO dto) {
        return ResponseEntity.ok(authService.verificarYGenerarToken(dto));
    }

    @PostMapping("/mfa/reenviar")
    public ResponseEntity<Void> reenviar(@RequestBody Map<String, String> body) {
        authService.reenviarCodigo(body.get("correo"));
        return ResponseEntity.ok().build();
    }
}
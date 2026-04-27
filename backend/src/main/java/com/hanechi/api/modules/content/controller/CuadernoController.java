package com.hanechi.api.modules.content.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hanechi.api.modules.content.dto.ActualizacionCuadernoDTO;
import com.hanechi.api.modules.content.dto.CuadernoDTO;
import com.hanechi.api.modules.content.dto.PeticionCuadernoDTO;
import com.hanechi.api.modules.content.service.CuadernoService;

@RestController
@RequestMapping("/api/cuadernos")
public class CuadernoController {
    private final CuadernoService cuadernoService;

    public CuadernoController(CuadernoService cuadernoService) {
        this.cuadernoService = cuadernoService;
    }

    @PostMapping("/usuario/{idUsuario}")
    public ResponseEntity<CuadernoDTO> crear(@PathVariable UUID idUsuario, @RequestBody PeticionCuadernoDTO dto) {
        return ResponseEntity.ok(cuadernoService.crearCuaderno(idUsuario, dto));
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<CuadernoDTO>> listarPorUsuario(@PathVariable UUID idUsuario) {
        return ResponseEntity.ok(cuadernoService.listarPorUsuario(idUsuario));
    }

    @GetMapping("/publicos")
    public ResponseEntity<List<CuadernoDTO>> listarPublicos() {
        return ResponseEntity.ok(cuadernoService.listarPublicos());
    }

    @GetMapping("/usuario/{idUsuario}/publicos")
    public ResponseEntity<List<CuadernoDTO>> listarPublicosPorUsuario(@PathVariable UUID idUsuario) {
        return ResponseEntity.ok(cuadernoService.listarPublicosPorUsuario(idUsuario));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CuadernoDTO> obtenerPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(cuadernoService.obtenerPorId(id));
    }

    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<CuadernoDTO> obtenerPorCodigo(@PathVariable String codigo) {
        return ResponseEntity.ok(cuadernoService.obtenerPorCodigo(codigo));
    }

    @PatchMapping("/{idCuaderno}")
    public ResponseEntity<CuadernoDTO> actualizar(@PathVariable UUID idCuaderno, @RequestBody ActualizacionCuadernoDTO dto) {
        return ResponseEntity.ok(cuadernoService.actualizarContenido(idCuaderno, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable UUID id) {
        cuadernoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
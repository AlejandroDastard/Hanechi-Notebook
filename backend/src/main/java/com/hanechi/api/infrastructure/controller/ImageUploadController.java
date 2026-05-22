package com.hanechi.api.infrastructure.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ImageUploadController {

    @PostMapping("/upload/{tipo}")
    public ResponseEntity<Map<String, String>> uploadImage(
            @PathVariable("tipo") String tipo,
            @RequestParam("file") MultipartFile file) {

        // Validamos el tipo para evitar inyecciones de rutas maliciosas
        if (!Arrays.asList("avatar", "banner", "notebook").contains(tipo)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Tipo de imagen no soportado"));
        }

        try {
            Path directorioImagenes = Paths.get("uploads", tipo);
            if (!Files.exists(directorioImagenes)) {
                Files.createDirectories(directorioImagenes);
            }

            String nombreOriginal = file.getOriginalFilename();
            String extension = "";
            if (nombreOriginal != null && nombreOriginal.contains(".")) {
                extension = nombreOriginal.substring(nombreOriginal.lastIndexOf("."));
            }
            String nombreUnico = UUID.randomUUID().toString() + extension;

            Path rutaCompleta = directorioImagenes.resolve(nombreUnico);
            Files.copy(file.getInputStream(), rutaCompleta, StandardCopyOption.REPLACE_EXISTING);

            Map<String, String> respuesta = new HashMap<>();
            respuesta.put("nombreArchivo", nombreUnico);
            return ResponseEntity.ok(respuesta);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al procesar la imagen: " + e.getMessage()));
        }
    }
}

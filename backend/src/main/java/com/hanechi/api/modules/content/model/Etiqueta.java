package com.hanechi.api.modules.content.model;

import java.util.UUID;

import com.hanechi.api.modules.content.dto.EtiquetaDTO;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "etiqueta")
@Data
@NoArgsConstructor
public class Etiqueta {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_etiqueta")
    private UUID id;

    @Column(nullable = false, unique = true)
    private String nombre;

    public Etiqueta(EtiquetaDTO dto) {
        if (dto != null) {
            this.id = dto.getId();
            this.nombre = dto.getNombre();
        }
    }
}
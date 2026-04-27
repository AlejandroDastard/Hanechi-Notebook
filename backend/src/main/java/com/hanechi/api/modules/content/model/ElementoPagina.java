package com.hanechi.api.modules.content.model;

import java.util.UUID;

import com.hanechi.api.modules.content.dto.ElementoPaginaDTO;
import com.hanechi.api.modules.content.enums.TipoElemento;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "elemento_pagina")
@Data
@NoArgsConstructor
public class ElementoPagina {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_elemento")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pagina", nullable = false)
    private Pagina pagina;

    @Column(nullable = false)
    private Integer orden;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoElemento tipo;

    @Column(nullable = false, length = 3000)
    private String contenido;

    public ElementoPagina(ElementoPaginaDTO dto) {
        if (dto != null) {
            this.id = dto.getId();
            this.orden = dto.getOrden();
            this.tipo = dto.getTipo();
            this.contenido = dto.getContenido();
        }
    }
}
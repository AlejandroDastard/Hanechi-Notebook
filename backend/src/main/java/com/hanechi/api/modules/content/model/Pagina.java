package com.hanechi.api.modules.content.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.hanechi.api.modules.content.dto.PaginaDTO;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pagina")
@Data
@NoArgsConstructor
public class Pagina {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_pagina")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cuaderno", nullable = false)
    private Cuaderno cuaderno;

    @Column(name = "numero_pagina", nullable = false)
    private Integer numeroPagina;

    @OneToMany(mappedBy = "pagina", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orden ASC")
    private List<ElementoPagina> elementos = new ArrayList<>();

    public Pagina(PaginaDTO dto) {
        if (dto != null) {
            this.id = dto.getId();
            this.numeroPagina = dto.getNumeroPagina();
            if (dto.getElementos() != null) {
                this.elementos = dto.getElementos().stream()
                    .map(e -> {
                        ElementoPagina ep = new ElementoPagina(e);
                        ep.setPagina(this);
                        return ep;
                    })
                    .collect(Collectors.toList());
            }
        }
    }
}
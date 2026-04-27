package com.hanechi.api.modules.content.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hanechi.api.modules.content.dto.ElementoPaginaDTO;
import com.hanechi.api.modules.content.model.ElementoPagina;
import com.hanechi.api.modules.content.model.Pagina;
import com.hanechi.api.modules.content.repository.ElementoPaginaRepository;
import com.hanechi.api.modules.content.repository.PaginaRepository;

@Service
public class ElementoPaginaService {
    private final ElementoPaginaRepository elementoRepository;
    private final PaginaRepository paginaRepository;
    private final FabricaElementoPaginaService fabricaElemento;

    public ElementoPaginaService(ElementoPaginaRepository elementoRepository, PaginaRepository paginaRepository, FabricaElementoPaginaService fabricaElemento) {
        this.elementoRepository = elementoRepository;
        this.paginaRepository = paginaRepository;
        this.fabricaElemento = fabricaElemento;
    }

    // --- POST ---

    @Transactional
    public ElementoPaginaDTO crearElemento(UUID idPagina, ElementoPaginaDTO dto) {
        Pagina pagina = paginaRepository.findById(idPagina)
            .orElseThrow(() -> new RuntimeException("Pagina no encontrada"));

        ElementoPagina elemento = fabricaElemento.crearElemento(dto, pagina);
        return fabricaElemento.crearDTO(elementoRepository.save(elemento));
    }

    // --- GET ---

    @Transactional(readOnly = true)
    public List<ElementoPaginaDTO> listarPorPagina(UUID idPagina) {
        return elementoRepository.findByPaginaIdOrderByOrdenAsc(idPagina).stream()
            .map(fabricaElemento::crearDTO)
            .collect(Collectors.toList());
    }

    // --- PATCH ---

    @Transactional
    public List<ElementoPaginaDTO> reordenarElemento(UUID idPagina, UUID idElemento, Integer nuevoOrden) {
        List<ElementoPagina> elementos = elementoRepository.findByPaginaIdOrderByOrdenAsc(idPagina);

        ElementoPagina elementoAMover = elementos.stream()
            .filter(e -> e.getId().equals(idElemento))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Elemento no encontrado"));

        elementos.remove(elementoAMover);

        int nuevoIndice = nuevoOrden - 1;
        if (nuevoIndice < 0) nuevoIndice = 0;
        if (nuevoIndice > elementos.size()) nuevoIndice = elementos.size();

        elementos.add(nuevoIndice, elementoAMover);

        for (int i = 0; i < elementos.size(); i++) {
            elementos.get(i).setOrden(i + 1);
        }

        elementoRepository.saveAll(elementos);

        return elementos.stream()
            .map(fabricaElemento::crearDTO)
            .collect(Collectors.toList());
    }

    // --- DELETE ---

    @Transactional
    public void eliminar(UUID id) {
        elementoRepository.deleteById(id);
    }
}
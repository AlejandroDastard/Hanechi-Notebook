package com.hanechi.api.modules.content.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hanechi.api.modules.content.dto.PaginaDTO;
import com.hanechi.api.modules.content.dto.PeticionPaginaDTO;
import com.hanechi.api.modules.content.model.Cuaderno;
import com.hanechi.api.modules.content.model.Pagina;
import com.hanechi.api.modules.content.repository.CuadernoRepository;
import com.hanechi.api.modules.content.repository.PaginaRepository;

@Service
public class PaginaService {
    private final PaginaRepository paginaRepository;
    private final CuadernoRepository cuadernoRepository;
    private final FabricaPaginaService fabricaPaginaService;

    public PaginaService(PaginaRepository paginaRepository, CuadernoRepository cuadernoRepository, FabricaPaginaService fabricaPaginaService) {
        this.paginaRepository = paginaRepository;
        this.cuadernoRepository = cuadernoRepository;
        this.fabricaPaginaService = fabricaPaginaService;
    }

    // --- POST ---

    @Transactional
    public PaginaDTO crearPagina(UUID idCuaderno, PeticionPaginaDTO dto) {
        Cuaderno cuaderno = cuadernoRepository.findById(idCuaderno)
            .orElseThrow(() -> new RuntimeException("Cuaderno no encontrado"));
        
        Pagina pagina = fabricaPaginaService.crearPagina(dto, cuaderno);
        return new PaginaDTO(paginaRepository.save(pagina));
    }

    // --- GET ---

    @Transactional(readOnly = true)
    public List<PaginaDTO> listarPorCuaderno(UUID idCuaderno) {
        return paginaRepository.findByCuadernoIdOrderByNumeroPaginaAsc(idCuaderno).stream()
            .map(PaginaDTO::new)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PaginaDTO obtenerPorId(UUID id) {
        Pagina pagina = paginaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pagina no encontrada"));
        
        return new PaginaDTO(pagina);
    }

    // --- DELETE ---

    @Transactional
    public void eliminar(UUID id) {
        paginaRepository.deleteById(id);
    }
}
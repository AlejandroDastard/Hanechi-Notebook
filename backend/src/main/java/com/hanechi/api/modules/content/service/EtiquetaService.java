package com.hanechi.api.modules.content.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hanechi.api.modules.content.dto.EtiquetaDTO;
import com.hanechi.api.modules.content.repository.EtiquetaRepository;

@Service
public class EtiquetaService {
    private final EtiquetaRepository etiquetaRepository;

    public EtiquetaService(EtiquetaRepository etiquetaRepository) {
        this.etiquetaRepository = etiquetaRepository;
    }

    // --- GET ---

    @Transactional(readOnly = true)
    public List<EtiquetaDTO> listarTodas() {
        return etiquetaRepository.findAll().stream()
            .map(EtiquetaDTO::new)
            .collect(Collectors.toList());
    }
}
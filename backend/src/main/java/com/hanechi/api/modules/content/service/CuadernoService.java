package com.hanechi.api.modules.content.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hanechi.api.modules.content.dto.ActualizacionCuadernoDTO;
import com.hanechi.api.modules.content.dto.CuadernoDTO;
import com.hanechi.api.modules.content.dto.PeticionCuadernoDTO;
import com.hanechi.api.modules.content.enums.EstadoCuaderno;
import com.hanechi.api.modules.content.model.Cuaderno;
import com.hanechi.api.modules.content.model.Etiqueta;
import com.hanechi.api.modules.content.repository.CuadernoRepository;
import com.hanechi.api.modules.content.repository.EtiquetaRepository;
import com.hanechi.api.modules.stats.service.EstadisticasUsuarioService;
import com.hanechi.api.modules.user.model.Usuario;
import com.hanechi.api.modules.user.repository.UsuarioRepository;

@Service
public class CuadernoService {
    private final CuadernoRepository cuadernoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EtiquetaRepository etiquetaRepository;
    private final FabricaCuadernoService fabricaCuadernoService;
    private final EstadisticasUsuarioService statsUsuarioService;

    public CuadernoService(CuadernoRepository cuadernoRepository, UsuarioRepository usuarioRepository, EtiquetaRepository etiquetaRepository, FabricaCuadernoService fabricaCuadernoService, EstadisticasUsuarioService statsUsuarioService) {
        this.cuadernoRepository = cuadernoRepository;
        this.usuarioRepository = usuarioRepository;
        this.etiquetaRepository = etiquetaRepository;
        this.fabricaCuadernoService = fabricaCuadernoService;
        this.statsUsuarioService = statsUsuarioService;
    }

    // --- POST ---

    @Transactional
    public CuadernoDTO crearCuaderno(UUID idUsuario, PeticionCuadernoDTO dto) {
        Usuario creador = usuarioRepository.findById(idUsuario)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Etiqueta> etiquetasSeleccionadas = new ArrayList<>();

        if (dto.getIdEtiquetas() != null && !dto.getIdEtiquetas().isEmpty()) {
            etiquetasSeleccionadas = etiquetaRepository.findAllById(dto.getIdEtiquetas());

            if (etiquetasSeleccionadas.size() != dto.getIdEtiquetas().size()) {
                throw new RuntimeException("Etiquetas no validas");
            }
        }

        Cuaderno cuaderno = fabricaCuadernoService.crearCuaderno(dto, creador, etiquetasSeleccionadas);
        statsUsuarioService.actualizarContadorCuadernos(idUsuario, true);

        return new CuadernoDTO(cuadernoRepository.save(cuaderno));
    }

    // --- GET ---

    @Transactional(readOnly = true)
    public List<CuadernoDTO> listarPorUsuario(UUID idUsuario) {
        return cuadernoRepository.findByUsuarioId(idUsuario).stream()
            .filter(c -> c.getEstado() != EstadoCuaderno.BORRADO)
            .map(CuadernoDTO::new)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CuadernoDTO> listarPublicos() {
        return cuadernoRepository.findPublicosGlobalesValidados().stream()
            .map(CuadernoDTO::new)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CuadernoDTO> listarPublicosPorUsuario(UUID idUsuario) {
        return cuadernoRepository.findPublicosPorUsuarioValidado(idUsuario).stream()
            .map(CuadernoDTO::new)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CuadernoDTO obtenerPorId(UUID id) {
        Cuaderno cuaderno = cuadernoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Cuaderno no encontrado"));
        
        if (cuaderno.getEstado() == EstadoCuaderno.BORRADO) {
            throw new RuntimeException("Cuaderno no disponible");
        }
        
        return new CuadernoDTO(cuaderno);
    }

    @Transactional(readOnly = true)
    public CuadernoDTO obtenerPorCodigo(String codigo) {
        Cuaderno cuaderno = cuadernoRepository.findByCodigo(codigo)
            .orElseThrow(() -> new RuntimeException("Cuaderno no encontrado"));

        if (cuaderno.getEstado() == EstadoCuaderno.BORRADO) {
            throw new RuntimeException("Cuaderno no disponible");
        }

        return new CuadernoDTO(cuaderno);
    }

    // --- PATCH ---

    @Transactional
    public CuadernoDTO actualizarContenido(UUID idCuaderno, ActualizacionCuadernoDTO dto) {
        Cuaderno cuaderno = cuadernoRepository.findById(idCuaderno)
            .orElseThrow(() -> new RuntimeException("Cuaderno no encontrado"));

        if (dto.getDescripcion() != null) {
            cuaderno.setDescripcion(dto.getDescripcion());
        }

        if (dto.getIdEtiquetas() != null) {
            List<Etiqueta> etiquetasSeleccionadas = etiquetaRepository.findAllById(dto.getIdEtiquetas());

            if (etiquetasSeleccionadas.size() != dto.getIdEtiquetas().size()) {
                throw new RuntimeException("Etiquetas no validas");
            }

            cuaderno.setEtiquetas(etiquetasSeleccionadas);
        }

        return new CuadernoDTO(cuadernoRepository.save(cuaderno));
    }

    // --- DELETE ---

    @Transactional
    public void eliminar(UUID id) {
        Cuaderno cuaderno = cuadernoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Cuaderno no encontrado"));
        
        cuaderno.setEstado(EstadoCuaderno.BORRADO);
        cuadernoRepository.save(cuaderno);

        statsUsuarioService.actualizarContadorCuadernos(cuaderno.getUsuario().getId(), false);
    }
}
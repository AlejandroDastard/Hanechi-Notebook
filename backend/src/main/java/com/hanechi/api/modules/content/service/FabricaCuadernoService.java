package com.hanechi.api.modules.content.service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.hanechi.api.modules.content.dto.PeticionCuadernoDTO;
import com.hanechi.api.modules.content.enums.EstadoCuaderno;
import com.hanechi.api.modules.content.enums.VisibilidadCuaderno;
import com.hanechi.api.modules.content.model.Cuaderno;
import com.hanechi.api.modules.content.model.Etiqueta;
import com.hanechi.api.modules.user.model.Usuario;
import com.hanechi.api.modules.stats.model.EstadisticasCuaderno;
import com.hanechi.api.modules.stats.service.FabricaEstadisticasCuadernoService;

@Service
public class FabricaCuadernoService {

    private final FabricaEstadisticasCuadernoService fabricaEstadisticas;

    public FabricaCuadernoService(FabricaEstadisticasCuadernoService fabricaEstadisticas) {
        this.fabricaEstadisticas = fabricaEstadisticas;
    }

    public Cuaderno crearCuaderno(PeticionCuadernoDTO dto, Usuario creador, List<Etiqueta> etiquetas) {
        Cuaderno cuaderno = new Cuaderno();

        cuaderno.setUsuario(creador);
        cuaderno.setTitulo(dto.getTitulo());
        cuaderno.setUrlPortada(dto.getUrlPortada());
        cuaderno.setDescripcion(dto.getDescripcion());
        cuaderno.setCodigo(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        cuaderno.setEstado(EstadoCuaderno.ACTIVO);
        cuaderno.setFechaCreacion(ZonedDateTime.now());
        cuaderno.setFechaActualizado(ZonedDateTime.now());
        cuaderno.setVisibilidad(dto.getVisibilidad() != null
                ? dto.getVisibilidad()
                : VisibilidadCuaderno.PRIVADO);
        cuaderno.setEtiquetas(etiquetas);

        EstadisticasCuaderno stats = fabricaEstadisticas.crearEstadisticasBase(cuaderno);

        return cuaderno;
    }

    public EstadisticasCuaderno crearEstadisticasParaCuaderno(Cuaderno cuaderno) {
        return fabricaEstadisticas.crearEstadisticasBase(cuaderno);
    }
}
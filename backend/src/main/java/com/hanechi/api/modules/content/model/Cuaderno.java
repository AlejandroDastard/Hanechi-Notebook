package com.hanechi.api.modules.content.model;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.hanechi.api.modules.content.dto.CuadernoDTO;
import com.hanechi.api.modules.content.enums.EstadoCuaderno;
import com.hanechi.api.modules.content.enums.VisibilidadCuaderno;
import com.hanechi.api.modules.stats.model.EstadisticasCuaderno;
import com.hanechi.api.modules.user.model.Usuario;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cuaderno")
@Data
@NoArgsConstructor
public class Cuaderno {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_cuaderno")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private String titulo;

    @Column(name = "url_portada", nullable = false)
    private String urlPortada;

    @Column
    private String descripcion;

    @Column(nullable = false)
    private String codigo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoCuaderno estado;

    @Column(name = "fecha_creacion", nullable = false)
    private ZonedDateTime fechaCreacion;

    @Column(name = "fecha_actualizado")
    private ZonedDateTime fechaActualizado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VisibilidadCuaderno visibilidad;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "cuaderno_etiqueta", joinColumns = @JoinColumn(name = "id_cuaderno"), inverseJoinColumns = @JoinColumn(name = "id_etiqueta"))
    private List<Etiqueta> etiquetas = new ArrayList<>();

    @OneToMany(mappedBy = "cuaderno", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pagina> paginas;

    @OneToOne(mappedBy = "cuaderno", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private EstadisticasCuaderno estadisticas;

    public Cuaderno(CuadernoDTO dto) {
        if (dto != null) {
            this.id = dto.getId();
            this.titulo = dto.getTitulo();
            this.urlPortada = dto.getUrlPortada();
            this.descripcion = dto.getDescripcion();
            this.codigo = dto.getCodigo();
            this.estado = dto.getEstado();
            this.fechaCreacion = dto.getFechaCreacion();
            this.fechaActualizado = dto.getFechaActualizado();
            this.visibilidad = dto.getVisibilidad();
        }
    }
}
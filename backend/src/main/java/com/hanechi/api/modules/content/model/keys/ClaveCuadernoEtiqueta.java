package com.hanechi.api.modules.content.model.keys;

import java.io.Serializable;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClaveCuadernoEtiqueta implements Serializable {
    @Column(name = "id_cuaderno")
    private UUID idCuaderno;

    @Column(name = "id_etiqueta")
    private UUID idEtiqueta;
}

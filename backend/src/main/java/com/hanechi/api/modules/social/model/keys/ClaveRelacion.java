package com.hanechi.api.modules.social.model.keys;

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
public class ClaveRelacion implements Serializable {
    @Column(name = "id_emisor")
    private UUID idEmisor;

    @Column(name = "id_receptor")
    private UUID idReceptor;
}

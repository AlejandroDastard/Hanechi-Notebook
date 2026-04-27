package com.hanechi.api.modules.content.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hanechi.api.modules.content.model.Etiqueta;

@Repository
public interface EtiquetaRepository extends JpaRepository<Etiqueta, UUID> {
}
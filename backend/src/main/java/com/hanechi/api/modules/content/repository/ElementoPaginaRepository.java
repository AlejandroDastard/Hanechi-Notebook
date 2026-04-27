package com.hanechi.api.modules.content.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hanechi.api.modules.content.model.ElementoPagina;

@Repository
public interface ElementoPaginaRepository extends JpaRepository<ElementoPagina, UUID> {
    List<ElementoPagina> findByPaginaIdOrderByOrdenAsc(UUID idPagina);
}
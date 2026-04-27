package com.hanechi.api.modules.content.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hanechi.api.modules.content.model.Pagina;

@Repository
public interface PaginaRepository extends JpaRepository<Pagina, UUID> {
    List<Pagina> findByCuadernoIdOrderByNumeroPaginaAsc(UUID idCuaderno);
}
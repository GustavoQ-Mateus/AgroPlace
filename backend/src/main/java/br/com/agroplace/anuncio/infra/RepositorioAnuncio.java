package br.com.agroplace.anuncio.infra;

import br.com.agroplace.anuncio.dominio.Anuncio;
import br.com.agroplace.anuncio.dominio.StatusAnuncio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepositorioAnuncio extends JpaRepository<Anuncio, Long> {
    Page<Anuncio> findByStatus(StatusAnuncio status, Pageable pageable);
    Page<Anuncio> findByEspecieAndStatus(String especie, StatusAnuncio status, Pageable pageable);
    Page<Anuncio> findByContaId(Long contaId, Pageable pageable);
}

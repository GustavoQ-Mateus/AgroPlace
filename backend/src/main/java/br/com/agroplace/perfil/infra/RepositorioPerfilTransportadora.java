package br.com.agroplace.perfil.infra;

import br.com.agroplace.perfil.dominio.PerfilTransportadora;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepositorioPerfilTransportadora extends JpaRepository<PerfilTransportadora, Long> {
    Optional<PerfilTransportadora> findByContaId(Long contaId);
    boolean existsByContaId(Long contaId);
}

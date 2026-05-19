package br.com.agroplace.perfil.infra;

import br.com.agroplace.perfil.dominio.PerfilCorporativa;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepositorioPerfilCorporativa extends JpaRepository<PerfilCorporativa, Long> {
    Optional<PerfilCorporativa> findByContaId(Long contaId);
    boolean existsByContaId(Long contaId);
}

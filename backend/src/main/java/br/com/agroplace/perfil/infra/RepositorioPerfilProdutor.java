package br.com.agroplace.perfil.infra;

import br.com.agroplace.perfil.dominio.PerfilProdutor;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepositorioPerfilProdutor extends JpaRepository<PerfilProdutor, Long> {
    Optional<PerfilProdutor> findByContaId(Long contaId);
    boolean existsByContaId(Long contaId);
}

package br.com.agroplace.autenticacao.infra;

import br.com.agroplace.autenticacao.dominio.ContaUsuario;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepositorioContaUsuario extends JpaRepository<ContaUsuario, Long> {
    Optional<ContaUsuario> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByDocumento(String documento);
}

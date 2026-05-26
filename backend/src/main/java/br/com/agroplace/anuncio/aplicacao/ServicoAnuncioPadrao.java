package br.com.agroplace.anuncio.aplicacao;

import br.com.agroplace.anuncio.aplicacao.dto.RequisicaoAnuncio;
import br.com.agroplace.anuncio.aplicacao.dto.RespostaAnuncio;
import br.com.agroplace.anuncio.dominio.Anuncio;
import br.com.agroplace.anuncio.dominio.StatusAnuncio;
import br.com.agroplace.anuncio.dominio.builder.AnuncioConcretoBuilder;
import br.com.agroplace.anuncio.dominio.builder.DiretorAnuncio;
import br.com.agroplace.anuncio.infra.RepositorioAnuncio;
import br.com.agroplace.autenticacao.dominio.ContaUsuario;
import br.com.agroplace.autenticacao.infra.RepositorioContaUsuario;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServicoAnuncioPadrao implements ServicoAnuncio {

    private final RepositorioAnuncio repoAnuncio;
    private final RepositorioContaUsuario repoConta;

    public ServicoAnuncioPadrao(RepositorioAnuncio repoAnuncio, RepositorioContaUsuario repoConta) {
        this.repoAnuncio = repoAnuncio;
        this.repoConta = repoConta;
    }

    @Override
    @Transactional
    public RespostaAnuncio criar(String emailConta, RequisicaoAnuncio req) {
        ContaUsuario conta = buscarConta(emailConta);
        DiretorAnuncio diretor = new DiretorAnuncio(new AnuncioConcretoBuilder());
        Anuncio anuncio = diretor.construirDaRequisicao(conta, req);
        return RespostaAnuncio.de(repoAnuncio.save(anuncio));
    }

    @Override
    public RespostaAnuncio buscarPorId(Long id) {
        return repoAnuncio.findById(id)
                .map(RespostaAnuncio::de)
                .orElseThrow(() -> new EntityNotFoundException("Anúncio não encontrado"));
    }

    @Override
    public Page<RespostaAnuncio> listar(String especie, Pageable pageable) {
        if (especie != null && !especie.isBlank()) {
            return repoAnuncio.findByEspecieAndStatus(especie, StatusAnuncio.ATIVO, pageable)
                    .map(RespostaAnuncio::de);
        }
        return repoAnuncio.findByStatus(StatusAnuncio.ATIVO, pageable).map(RespostaAnuncio::de);
    }

    @Override
    public Page<RespostaAnuncio> listarMeus(String emailConta, Pageable pageable) {
        ContaUsuario conta = buscarConta(emailConta);
        return repoAnuncio.findByContaId(conta.getId(), pageable).map(RespostaAnuncio::de);
    }

    @Override
    @Transactional
    public RespostaAnuncio atualizar(Long id, String emailConta, RequisicaoAnuncio req) {
        Anuncio anuncio = buscarAnuncioDoVendedor(id, emailConta);
        anuncio.atualizar(req.titulo(), req.especie(), req.raca(), req.quantidade(),
                req.pesoMedioKg(), req.idadeMediaMeses(), req.sexo(),
                req.precoUnitario(), req.cidade(), req.estado(), req.descricao());
        return RespostaAnuncio.de(repoAnuncio.save(anuncio));
    }

    @Override
    @Transactional
    public void encerrar(Long id, String emailConta) {
        Anuncio anuncio = buscarAnuncioDoVendedor(id, emailConta);
        anuncio.encerrar();
        repoAnuncio.save(anuncio);
    }

    private Anuncio buscarAnuncioDoVendedor(Long id, String emailConta) {
        Anuncio anuncio = repoAnuncio.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Anúncio não encontrado"));
        if (!anuncio.pertenceA(emailConta)) {
            throw new IllegalArgumentException("Você não tem permissão para editar este anúncio");
        }
        return anuncio;
    }

    private ContaUsuario buscarConta(String email) {
        return repoConta.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Conta não encontrada"));
    }
}

package br.com.agroplace.perfil.aplicacao;

import br.com.agroplace.autenticacao.dominio.ContaUsuario;
import br.com.agroplace.autenticacao.infra.RepositorioContaUsuario;
import br.com.agroplace.perfil.aplicacao.dto.RequisicaoPerfilCorporativa;
import br.com.agroplace.perfil.aplicacao.dto.RequisicaoPerfilProdutor;
import br.com.agroplace.perfil.aplicacao.dto.RequisicaoPerfilTransportadora;
import br.com.agroplace.perfil.dominio.PerfilCorporativa;
import br.com.agroplace.perfil.dominio.PerfilProdutor;
import br.com.agroplace.perfil.dominio.PerfilTransportadora;
import br.com.agroplace.perfil.dominio.builder.DiretorPerfilCorporativa;
import br.com.agroplace.perfil.dominio.builder.DiretorPerfilProdutor;
import br.com.agroplace.perfil.dominio.builder.DiretorPerfilTransportadora;
import br.com.agroplace.perfil.dominio.builder.PerfilCorporativaConcretoBuilder;
import br.com.agroplace.perfil.dominio.builder.PerfilProdutorConcretoBuilder;
import br.com.agroplace.perfil.dominio.builder.PerfilTransportadoraConcretoBuilder;
import br.com.agroplace.perfil.infra.RepositorioPerfilCorporativa;
import br.com.agroplace.perfil.infra.RepositorioPerfilProdutor;
import br.com.agroplace.perfil.infra.RepositorioPerfilTransportadora;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServicoPerfilPadrao implements ServicoPerfil {

    private final RepositorioContaUsuario repoConta;
    private final RepositorioPerfilProdutor repoProdutor;
    private final RepositorioPerfilCorporativa repoCorporativa;
    private final RepositorioPerfilTransportadora repoTransportadora;

    public ServicoPerfilPadrao(RepositorioContaUsuario repoConta,
            RepositorioPerfilProdutor repoProdutor,
            RepositorioPerfilCorporativa repoCorporativa,
            RepositorioPerfilTransportadora repoTransportadora) {
        this.repoConta = repoConta;
        this.repoProdutor = repoProdutor;
        this.repoCorporativa = repoCorporativa;
        this.repoTransportadora = repoTransportadora;
    }

    @Override
    @Transactional
    public Map<String, Object> salvarProdutor(String emailConta, RequisicaoPerfilProdutor req) {
        ContaUsuario conta = buscarConta(emailConta);
        DiretorPerfilProdutor diretor = new DiretorPerfilProdutor(new PerfilProdutorConcretoBuilder());
        PerfilProdutor perfil = repoProdutor.findByContaId(conta.getId())
                .orElseGet(() -> diretor.construirDaRequisicao(conta, req));

        if (perfil.getId() != null) {
            perfil.atualizar(req.nomePropriedade(), req.documentoRural(), req.inscricaoEstadual(),
                    req.car(), req.areaHectares(), req.cep(), req.endereco(),
                    req.cidade(), req.estado(), req.descricao());
        }
        repoProdutor.save(perfil);
        return Map.of("mensagem", "Perfil produtor salvo com sucesso", "id", perfil.getId() != null ? perfil.getId() : 0);
    }

    @Override
    @Transactional
    public Map<String, Object> salvarCorporativa(String emailConta, RequisicaoPerfilCorporativa req) {
        ContaUsuario conta = buscarConta(emailConta);

        if (repoCorporativa.findByContaId(conta.getId()).isEmpty()
                && repoCorporativa.existsById(-1L) // dummy para reutilizar CNPJ check via query
        ) {
            throw new IllegalArgumentException("CNPJ já cadastrado");
        }

        DiretorPerfilCorporativa diretor = new DiretorPerfilCorporativa(new PerfilCorporativaConcretoBuilder());
        PerfilCorporativa perfil = repoCorporativa.findByContaId(conta.getId())
                .orElseGet(() -> diretor.construirDaRequisicao(conta, req));

        if (perfil.getId() != null) {
            perfil.atualizar(req.razaoSocial(), req.nomeFantasia(), req.inscricaoEstadual(),
                    req.segmento(), req.responsavelComercial(), req.telefoneComercial(),
                    req.site(), req.cep(), req.endereco(), req.cidade(), req.estado(), req.descricao());
        }
        repoCorporativa.save(perfil);
        return Map.of("mensagem", "Perfil corporativo salvo com sucesso");
    }

    @Override
    @Transactional
    public Map<String, Object> salvarTransportadora(String emailConta, RequisicaoPerfilTransportadora req) {
        ContaUsuario conta = buscarConta(emailConta);
        DiretorPerfilTransportadora diretor = new DiretorPerfilTransportadora(new PerfilTransportadoraConcretoBuilder());
        PerfilTransportadora perfil = repoTransportadora.findByContaId(conta.getId())
                .orElseGet(() -> diretor.construirDaRequisicao(conta, req));

        if (perfil.getId() != null) {
            perfil.atualizar(req.razaoSocial(), req.nomeFantasia(), req.rntrc(),
                    req.inscricaoEstadual(), req.responsavelOperacional(), req.telefoneOperacional(),
                    req.tiposVeiculo(), req.capacidadeCargaKg(), req.possuiTransporteVivo(),
                    req.cep(), req.endereco(), req.cidade(), req.estado(), req.descricao());
        }
        repoTransportadora.save(perfil);
        return Map.of("mensagem", "Perfil transportadora salvo com sucesso");
    }

    @Override
    public Map<String, Object> buscarMeuPerfil(String emailConta) {
        ContaUsuario conta = buscarConta(emailConta);
        return switch (conta.getTipoConta()) {
            case PRODUTOR -> repoProdutor.findByContaId(conta.getId())
                    .map(p -> Map.<String, Object>of(
                            "tipo", "PRODUTOR",
                            "nomePropriedade", p.getNomePropriedade(),
                            "cidade", p.getCidade(),
                            "estado", p.getEstado()
                    ))
                    .orElse(Map.of("mensagem", "Perfil não preenchido"));
            case CORPORATIVA -> repoCorporativa.findByContaId(conta.getId())
                    .map(p -> Map.<String, Object>of(
                            "tipo", "CORPORATIVA",
                            "razaoSocial", p.getRazaoSocial(),
                            "cnpj", p.getCnpj(),
                            "cidade", p.getCidade(),
                            "estado", p.getEstado()
                    ))
                    .orElse(Map.of("mensagem", "Perfil não preenchido"));
            case TRANSPORTADORA -> repoTransportadora.findByContaId(conta.getId())
                    .map(p -> Map.<String, Object>of(
                            "tipo", "TRANSPORTADORA",
                            "razaoSocial", p.getRazaoSocial(),
                            "cnpj", p.getCnpj(),
                            "cidade", p.getCidade(),
                            "estado", p.getEstado()
                    ))
                    .orElse(Map.of("mensagem", "Perfil não preenchido"));
        };
    }

    private ContaUsuario buscarConta(String email) {
        return repoConta.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Conta não encontrada"));
    }
}

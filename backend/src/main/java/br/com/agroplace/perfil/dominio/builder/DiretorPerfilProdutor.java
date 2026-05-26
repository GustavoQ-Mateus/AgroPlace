package br.com.agroplace.perfil.dominio.builder;

import br.com.agroplace.autenticacao.dominio.ContaUsuario;
import br.com.agroplace.perfil.aplicacao.dto.RequisicaoPerfilProdutor;
import br.com.agroplace.perfil.dominio.PerfilProdutor;

public class DiretorPerfilProdutor {

    private final PerfilProdutorBuilder builder;

    public DiretorPerfilProdutor(PerfilProdutorBuilder builder) {
        this.builder = builder;
    }

    public PerfilProdutor construirDaRequisicao(ContaUsuario conta, RequisicaoPerfilProdutor req) {
        return builder
                .conta(conta)
                .nomePropriedade(req.nomePropriedade())
                .documentoRural(req.documentoRural())
                .inscricaoEstadual(req.inscricaoEstadual())
                .car(req.car())
                .areaHectares(req.areaHectares())
                .cep(req.cep())
                .endereco(req.endereco())
                .cidade(req.cidade())
                .estado(req.estado())
                .descricao(req.descricao())
                .construir();
    }
}

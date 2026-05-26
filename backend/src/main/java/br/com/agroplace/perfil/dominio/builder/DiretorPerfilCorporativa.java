package br.com.agroplace.perfil.dominio.builder;

import br.com.agroplace.autenticacao.dominio.ContaUsuario;
import br.com.agroplace.perfil.aplicacao.dto.RequisicaoPerfilCorporativa;
import br.com.agroplace.perfil.dominio.PerfilCorporativa;

public class DiretorPerfilCorporativa {

    private final PerfilCorporativaBuilder builder;

    public DiretorPerfilCorporativa(PerfilCorporativaBuilder builder) {
        this.builder = builder;
    }

    public PerfilCorporativa construirDaRequisicao(ContaUsuario conta, RequisicaoPerfilCorporativa req) {
        return builder
                .conta(conta)
                .razaoSocial(req.razaoSocial())
                .nomeFantasia(req.nomeFantasia())
                .cnpj(req.cnpj())
                .inscricaoEstadual(req.inscricaoEstadual())
                .segmento(req.segmento())
                .responsavelComercial(req.responsavelComercial())
                .telefoneComercial(req.telefoneComercial())
                .site(req.site())
                .cep(req.cep())
                .endereco(req.endereco())
                .cidade(req.cidade())
                .estado(req.estado())
                .descricao(req.descricao())
                .construir();
    }
}

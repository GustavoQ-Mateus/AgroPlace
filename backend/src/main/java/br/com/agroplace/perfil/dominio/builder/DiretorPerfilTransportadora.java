package br.com.agroplace.perfil.dominio.builder;

import br.com.agroplace.autenticacao.dominio.ContaUsuario;
import br.com.agroplace.perfil.aplicacao.dto.RequisicaoPerfilTransportadora;
import br.com.agroplace.perfil.dominio.PerfilTransportadora;

public class DiretorPerfilTransportadora {

    private final PerfilTransportadoraBuilder builder;

    public DiretorPerfilTransportadora(PerfilTransportadoraBuilder builder) {
        this.builder = builder;
    }

    public PerfilTransportadora construirDaRequisicao(ContaUsuario conta, RequisicaoPerfilTransportadora req) {
        return builder
                .conta(conta)
                .razaoSocial(req.razaoSocial())
                .nomeFantasia(req.nomeFantasia())
                .cnpj(req.cnpj())
                .rntrc(req.rntrc())
                .inscricaoEstadual(req.inscricaoEstadual())
                .responsavelOperacional(req.responsavelOperacional())
                .telefoneOperacional(req.telefoneOperacional())
                .tiposVeiculo(req.tiposVeiculo())
                .capacidadeCargaKg(req.capacidadeCargaKg())
                .possuiTransporteVivo(req.possuiTransporteVivo())
                .cep(req.cep())
                .endereco(req.endereco())
                .cidade(req.cidade())
                .estado(req.estado())
                .descricao(req.descricao())
                .construir();
    }
}

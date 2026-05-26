package br.com.agroplace.perfil.dominio.builder;

import br.com.agroplace.autenticacao.dominio.ContaUsuario;
import br.com.agroplace.perfil.dominio.PerfilTransportadora;
import java.math.BigDecimal;

public interface PerfilTransportadoraBuilder {
    PerfilTransportadoraBuilder conta(ContaUsuario conta);
    PerfilTransportadoraBuilder razaoSocial(String razaoSocial);
    PerfilTransportadoraBuilder nomeFantasia(String nomeFantasia);
    PerfilTransportadoraBuilder cnpj(String cnpj);
    PerfilTransportadoraBuilder rntrc(String rntrc);
    PerfilTransportadoraBuilder inscricaoEstadual(String inscricaoEstadual);
    PerfilTransportadoraBuilder responsavelOperacional(String responsavelOperacional);
    PerfilTransportadoraBuilder telefoneOperacional(String telefoneOperacional);
    PerfilTransportadoraBuilder tiposVeiculo(String tiposVeiculo);
    PerfilTransportadoraBuilder capacidadeCargaKg(BigDecimal capacidadeCargaKg);
    PerfilTransportadoraBuilder possuiTransporteVivo(boolean possuiTransporteVivo);
    PerfilTransportadoraBuilder cep(String cep);
    PerfilTransportadoraBuilder endereco(String endereco);
    PerfilTransportadoraBuilder cidade(String cidade);
    PerfilTransportadoraBuilder estado(String estado);
    PerfilTransportadoraBuilder descricao(String descricao);
    PerfilTransportadora construir();
}

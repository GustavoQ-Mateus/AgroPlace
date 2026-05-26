package br.com.agroplace.perfil.dominio.builder;

import br.com.agroplace.autenticacao.dominio.ContaUsuario;
import br.com.agroplace.perfil.dominio.PerfilTransportadora;
import java.math.BigDecimal;

public class PerfilTransportadoraConcretoBuilder implements PerfilTransportadoraBuilder {

    private ContaUsuario conta;
    private String razaoSocial;
    private String nomeFantasia;
    private String cnpj;
    private String rntrc;
    private String inscricaoEstadual;
    private String responsavelOperacional;
    private String telefoneOperacional;
    private String tiposVeiculo;
    private BigDecimal capacidadeCargaKg;
    private boolean possuiTransporteVivo = true;
    private String cep;
    private String endereco;
    private String cidade;
    private String estado;
    private String descricao;

    @Override
    public PerfilTransportadoraBuilder conta(ContaUsuario conta) { this.conta = conta; return this; }

    @Override
    public PerfilTransportadoraBuilder razaoSocial(String razaoSocial) { this.razaoSocial = razaoSocial; return this; }

    @Override
    public PerfilTransportadoraBuilder nomeFantasia(String nomeFantasia) { this.nomeFantasia = nomeFantasia; return this; }

    @Override
    public PerfilTransportadoraBuilder cnpj(String cnpj) { this.cnpj = cnpj; return this; }

    @Override
    public PerfilTransportadoraBuilder rntrc(String rntrc) { this.rntrc = rntrc; return this; }

    @Override
    public PerfilTransportadoraBuilder inscricaoEstadual(String inscricaoEstadual) { this.inscricaoEstadual = inscricaoEstadual; return this; }

    @Override
    public PerfilTransportadoraBuilder responsavelOperacional(String responsavelOperacional) { this.responsavelOperacional = responsavelOperacional; return this; }

    @Override
    public PerfilTransportadoraBuilder telefoneOperacional(String telefoneOperacional) { this.telefoneOperacional = telefoneOperacional; return this; }

    @Override
    public PerfilTransportadoraBuilder tiposVeiculo(String tiposVeiculo) { this.tiposVeiculo = tiposVeiculo; return this; }

    @Override
    public PerfilTransportadoraBuilder capacidadeCargaKg(BigDecimal capacidadeCargaKg) { this.capacidadeCargaKg = capacidadeCargaKg; return this; }

    @Override
    public PerfilTransportadoraBuilder possuiTransporteVivo(boolean possuiTransporteVivo) { this.possuiTransporteVivo = possuiTransporteVivo; return this; }

    @Override
    public PerfilTransportadoraBuilder cep(String cep) { this.cep = cep; return this; }

    @Override
    public PerfilTransportadoraBuilder endereco(String endereco) { this.endereco = endereco; return this; }

    @Override
    public PerfilTransportadoraBuilder cidade(String cidade) { this.cidade = cidade; return this; }

    @Override
    public PerfilTransportadoraBuilder estado(String estado) { this.estado = estado; return this; }

    @Override
    public PerfilTransportadoraBuilder descricao(String descricao) { this.descricao = descricao; return this; }

    @Override
    public PerfilTransportadora construir() {
        validar();
        return new PerfilTransportadora(this);
    }

    private void validar() {
        if (conta == null) throw new IllegalStateException("Conta é obrigatória");
        if (razaoSocial == null || razaoSocial.isBlank()) throw new IllegalStateException("Razão social é obrigatória");
        if (cnpj == null || cnpj.isBlank()) throw new IllegalStateException("CNPJ é obrigatório");
        if (cidade == null || cidade.isBlank()) throw new IllegalStateException("Cidade é obrigatória");
        if (estado == null || estado.length() != 2) throw new IllegalStateException("Estado inválido");
    }

    public ContaUsuario getConta() { return conta; }
    public String getRazaoSocial() { return razaoSocial; }
    public String getNomeFantasia() { return nomeFantasia; }
    public String getCnpj() { return cnpj; }
    public String getRntrc() { return rntrc; }
    public String getInscricaoEstadual() { return inscricaoEstadual; }
    public String getResponsavelOperacional() { return responsavelOperacional; }
    public String getTelefoneOperacional() { return telefoneOperacional; }
    public String getTiposVeiculo() { return tiposVeiculo; }
    public BigDecimal getCapacidadeCargaKg() { return capacidadeCargaKg; }
    public boolean isPossuiTransporteVivo() { return possuiTransporteVivo; }
    public String getCep() { return cep; }
    public String getEndereco() { return endereco; }
    public String getCidade() { return cidade; }
    public String getEstado() { return estado; }
    public String getDescricao() { return descricao; }
}

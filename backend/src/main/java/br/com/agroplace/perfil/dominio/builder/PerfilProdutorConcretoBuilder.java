package br.com.agroplace.perfil.dominio.builder;

import br.com.agroplace.autenticacao.dominio.ContaUsuario;
import br.com.agroplace.perfil.dominio.PerfilProdutor;
import java.math.BigDecimal;

public class PerfilProdutorConcretoBuilder implements PerfilProdutorBuilder {

    private ContaUsuario conta;
    private String nomePropriedade;
    private String documentoRural;
    private String inscricaoEstadual;
    private String car;
    private BigDecimal areaHectares;
    private String cep;
    private String endereco;
    private String cidade;
    private String estado;
    private String descricao;

    @Override
    public PerfilProdutorBuilder conta(ContaUsuario conta) { this.conta = conta; return this; }

    @Override
    public PerfilProdutorBuilder nomePropriedade(String nomePropriedade) { this.nomePropriedade = nomePropriedade; return this; }

    @Override
    public PerfilProdutorBuilder documentoRural(String documentoRural) { this.documentoRural = documentoRural; return this; }

    @Override
    public PerfilProdutorBuilder inscricaoEstadual(String inscricaoEstadual) { this.inscricaoEstadual = inscricaoEstadual; return this; }

    @Override
    public PerfilProdutorBuilder car(String car) { this.car = car; return this; }

    @Override
    public PerfilProdutorBuilder areaHectares(BigDecimal areaHectares) { this.areaHectares = areaHectares; return this; }

    @Override
    public PerfilProdutorBuilder cep(String cep) { this.cep = cep; return this; }

    @Override
    public PerfilProdutorBuilder endereco(String endereco) { this.endereco = endereco; return this; }

    @Override
    public PerfilProdutorBuilder cidade(String cidade) { this.cidade = cidade; return this; }

    @Override
    public PerfilProdutorBuilder estado(String estado) { this.estado = estado; return this; }

    @Override
    public PerfilProdutorBuilder descricao(String descricao) { this.descricao = descricao; return this; }

    @Override
    public PerfilProdutor construir() {
        validar();
        return new PerfilProdutor(this);
    }

    private void validar() {
        if (conta == null) throw new IllegalStateException("Conta é obrigatória");
        if (nomePropriedade == null || nomePropriedade.isBlank()) throw new IllegalStateException("Nome da propriedade é obrigatório");
        if (cidade == null || cidade.isBlank()) throw new IllegalStateException("Cidade é obrigatória");
        if (estado == null || estado.length() != 2) throw new IllegalStateException("Estado inválido");
    }

    public ContaUsuario getConta() { return conta; }
    public String getNomePropriedade() { return nomePropriedade; }
    public String getDocumentoRural() { return documentoRural; }
    public String getInscricaoEstadual() { return inscricaoEstadual; }
    public String getCar() { return car; }
    public BigDecimal getAreaHectares() { return areaHectares; }
    public String getCep() { return cep; }
    public String getEndereco() { return endereco; }
    public String getCidade() { return cidade; }
    public String getEstado() { return estado; }
    public String getDescricao() { return descricao; }
}

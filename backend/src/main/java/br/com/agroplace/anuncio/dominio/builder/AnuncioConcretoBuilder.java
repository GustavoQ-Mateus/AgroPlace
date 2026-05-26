package br.com.agroplace.anuncio.dominio.builder;

import br.com.agroplace.anuncio.dominio.Anuncio;
import br.com.agroplace.anuncio.dominio.SexoAnimal;
import br.com.agroplace.autenticacao.dominio.ContaUsuario;
import java.math.BigDecimal;

public class AnuncioConcretoBuilder implements AnuncioBuilder {

    private ContaUsuario conta;
    private String titulo;
    private String especie;
    private String raca;
    private int quantidade;
    private BigDecimal pesoMedioKg;
    private Integer idadeMediaMeses;
    private SexoAnimal sexo;
    private BigDecimal precoUnitario;
    private String cidade;
    private String estado;
    private String descricao;

    @Override
    public AnuncioBuilder conta(ContaUsuario conta) { this.conta = conta; return this; }

    @Override
    public AnuncioBuilder titulo(String titulo) { this.titulo = titulo; return this; }

    @Override
    public AnuncioBuilder especie(String especie) { this.especie = especie; return this; }

    @Override
    public AnuncioBuilder raca(String raca) { this.raca = raca; return this; }

    @Override
    public AnuncioBuilder quantidade(int quantidade) { this.quantidade = quantidade; return this; }

    @Override
    public AnuncioBuilder pesoMedioKg(BigDecimal pesoMedioKg) { this.pesoMedioKg = pesoMedioKg; return this; }

    @Override
    public AnuncioBuilder idadeMediaMeses(Integer idadeMediaMeses) { this.idadeMediaMeses = idadeMediaMeses; return this; }

    @Override
    public AnuncioBuilder sexo(SexoAnimal sexo) { this.sexo = sexo; return this; }

    @Override
    public AnuncioBuilder precoUnitario(BigDecimal precoUnitario) { this.precoUnitario = precoUnitario; return this; }

    @Override
    public AnuncioBuilder cidade(String cidade) { this.cidade = cidade; return this; }

    @Override
    public AnuncioBuilder estado(String estado) { this.estado = estado; return this; }

    @Override
    public AnuncioBuilder descricao(String descricao) { this.descricao = descricao; return this; }

    @Override
    public Anuncio construir() {
        validar();
        return new Anuncio(this);
    }

    private void validar() {
        if (conta == null) throw new IllegalStateException("Conta é obrigatória");
        if (titulo == null || titulo.isBlank()) throw new IllegalStateException("Título é obrigatório");
        if (especie == null || especie.isBlank()) throw new IllegalStateException("Espécie é obrigatória");
        if (quantidade < 1) throw new IllegalStateException("Quantidade deve ser ao menos 1");
        if (sexo == null) throw new IllegalStateException("Sexo é obrigatório");
        if (precoUnitario == null || precoUnitario.compareTo(BigDecimal.ZERO) <= 0)
            throw new IllegalStateException("Preço unitário deve ser positivo");
        if (cidade == null || cidade.isBlank()) throw new IllegalStateException("Cidade é obrigatória");
        if (estado == null || estado.length() != 2) throw new IllegalStateException("Estado inválido");
    }

    public ContaUsuario getConta() { return conta; }
    public String getTitulo() { return titulo; }
    public String getEspecie() { return especie; }
    public String getRaca() { return raca; }
    public int getQuantidade() { return quantidade; }
    public BigDecimal getPesoMedioKg() { return pesoMedioKg; }
    public Integer getIdadeMediaMeses() { return idadeMediaMeses; }
    public SexoAnimal getSexo() { return sexo; }
    public BigDecimal getPrecoUnitario() { return precoUnitario; }
    public String getCidade() { return cidade; }
    public String getEstado() { return estado; }
    public String getDescricao() { return descricao; }
}

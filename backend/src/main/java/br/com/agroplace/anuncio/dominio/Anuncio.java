package br.com.agroplace.anuncio.dominio;

import br.com.agroplace.autenticacao.dominio.ContaUsuario;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "anuncios")
public class Anuncio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conta_usuario_id", nullable = false)
    private ContaUsuario conta;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(nullable = false, length = 60)
    private String especie;

    @Column(length = 120)
    private String raca;

    @Column(nullable = false)
    private int quantidade;

    @Column(name = "peso_medio_kg", precision = 8, scale = 2)
    private BigDecimal pesoMedioKg;

    @Column(name = "idade_media_meses")
    private Integer idadeMediaMeses;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private SexoAnimal sexo;

    @Column(name = "preco_unitario", nullable = false, precision = 12, scale = 2)
    private BigDecimal precoUnitario;

    @Column(nullable = false, length = 120)
    private String cidade;

    @Column(nullable = false, length = 2)
    private String estado;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusAnuncio status = StatusAnuncio.ATIVO;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;

    protected Anuncio() {}

    public Anuncio(ContaUsuario conta, String titulo, String especie, String raca,
            int quantidade, BigDecimal pesoMedioKg, Integer idadeMediaMeses, SexoAnimal sexo,
            BigDecimal precoUnitario, String cidade, String estado, String descricao) {
        this.conta = conta;
        this.titulo = titulo;
        this.especie = especie;
        this.raca = raca;
        this.quantidade = quantidade;
        this.pesoMedioKg = pesoMedioKg;
        this.idadeMediaMeses = idadeMediaMeses;
        this.sexo = sexo;
        this.precoUnitario = precoUnitario;
        this.cidade = cidade;
        this.estado = estado;
        this.descricao = descricao;
    }

    public void atualizar(String titulo, String especie, String raca, int quantidade,
            BigDecimal pesoMedioKg, Integer idadeMediaMeses, SexoAnimal sexo,
            BigDecimal precoUnitario, String cidade, String estado, String descricao) {
        this.titulo = titulo;
        this.especie = especie;
        this.raca = raca;
        this.quantidade = quantidade;
        this.pesoMedioKg = pesoMedioKg;
        this.idadeMediaMeses = idadeMediaMeses;
        this.sexo = sexo;
        this.precoUnitario = precoUnitario;
        this.cidade = cidade;
        this.estado = estado;
        this.descricao = descricao;
    }

    public void encerrar() {
        this.status = StatusAnuncio.CANCELADO;
    }

    public boolean pertenceA(String email) {
        return conta.getEmail().equals(email);
    }

    @PrePersist void aoCriar() { criadoEm = LocalDateTime.now(); atualizadoEm = criadoEm; }
    @PreUpdate void aoAtualizar() { atualizadoEm = LocalDateTime.now(); }

    public Long getId() { return id; }
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
    public StatusAnuncio getStatus() { return status; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
}

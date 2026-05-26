package br.com.agroplace.perfil.dominio;

import br.com.agroplace.autenticacao.dominio.ContaUsuario;
import br.com.agroplace.perfil.dominio.builder.PerfilProdutorConcretoBuilder;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "perfis_produtor")
public class PerfilProdutor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conta_usuario_id", nullable = false, unique = true)
    private ContaUsuario conta;

    @Column(name = "nome_propriedade", nullable = false, length = 180)
    private String nomePropriedade;

    @Column(name = "documento_rural", length = 60)
    private String documentoRural;

    @Column(name = "inscricao_estadual", length = 60)
    private String inscricaoEstadual;

    @Column(length = 80)
    private String car;

    @Column(name = "area_hectares", precision = 10, scale = 2)
    private BigDecimal areaHectares;

    @Column(length = 12)
    private String cep;

    @Column(length = 220)
    private String endereco;

    @Column(nullable = false, length = 120)
    private String cidade;

    @Column(nullable = false, length = 2)
    private String estado;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;

    protected PerfilProdutor() {}

    public PerfilProdutor(PerfilProdutorConcretoBuilder b) {
        this.conta = b.getConta();
        this.nomePropriedade = b.getNomePropriedade();
        this.documentoRural = b.getDocumentoRural();
        this.inscricaoEstadual = b.getInscricaoEstadual();
        this.car = b.getCar();
        this.areaHectares = b.getAreaHectares();
        this.cep = b.getCep();
        this.endereco = b.getEndereco();
        this.cidade = b.getCidade();
        this.estado = b.getEstado();
        this.descricao = b.getDescricao();
    }

    public PerfilProdutor(ContaUsuario conta, String nomePropriedade, String documentoRural,
            String inscricaoEstadual, String car, BigDecimal areaHectares, String cep,
            String endereco, String cidade, String estado, String descricao) {
        this.conta = conta;
        this.nomePropriedade = nomePropriedade;
        this.documentoRural = documentoRural;
        this.inscricaoEstadual = inscricaoEstadual;
        this.car = car;
        this.areaHectares = areaHectares;
        this.cep = cep;
        this.endereco = endereco;
        this.cidade = cidade;
        this.estado = estado;
        this.descricao = descricao;
    }

    public void atualizar(String nomePropriedade, String documentoRural, String inscricaoEstadual,
            String car, BigDecimal areaHectares, String cep, String endereco,
            String cidade, String estado, String descricao) {
        this.nomePropriedade = nomePropriedade;
        this.documentoRural = documentoRural;
        this.inscricaoEstadual = inscricaoEstadual;
        this.car = car;
        this.areaHectares = areaHectares;
        this.cep = cep;
        this.endereco = endereco;
        this.cidade = cidade;
        this.estado = estado;
        this.descricao = descricao;
    }

    @PrePersist
    void aoCriar() {
        criadoEm = LocalDateTime.now();
        atualizadoEm = criadoEm;
    }

    @PreUpdate
    void aoAtualizar() {
        atualizadoEm = LocalDateTime.now();
    }

    public Long getId() { return id; }
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
    public LocalDateTime getCriadoEm() { return criadoEm; }
}

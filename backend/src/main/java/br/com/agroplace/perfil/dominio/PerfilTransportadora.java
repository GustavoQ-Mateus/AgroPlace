package br.com.agroplace.perfil.dominio;

import br.com.agroplace.autenticacao.dominio.ContaUsuario;
import br.com.agroplace.perfil.dominio.builder.PerfilTransportadoraConcretoBuilder;
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
@Table(name = "perfis_transportadora")
public class PerfilTransportadora {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conta_usuario_id", nullable = false, unique = true)
    private ContaUsuario conta;

    @Column(name = "razao_social", nullable = false, length = 180)
    private String razaoSocial;

    @Column(name = "nome_fantasia", length = 180)
    private String nomeFantasia;

    @Column(nullable = false, unique = true, length = 20)
    private String cnpj;

    @Column(length = 40)
    private String rntrc;

    @Column(name = "inscricao_estadual", length = 60)
    private String inscricaoEstadual;

    @Column(name = "responsavel_operacional", length = 160)
    private String responsavelOperacional;

    @Column(name = "telefone_operacional", length = 32)
    private String telefoneOperacional;

    @Column(name = "tipos_veiculo", length = 255)
    private String tiposVeiculo;

    @Column(name = "capacidade_carga_kg", precision = 10, scale = 2)
    private BigDecimal capacidadeCargaKg;

    @Column(name = "possui_transporte_vivo", nullable = false)
    private boolean possuiTransporteVivo = true;

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

    protected PerfilTransportadora() {}

    public PerfilTransportadora(PerfilTransportadoraConcretoBuilder b) {
        this.conta = b.getConta();
        this.razaoSocial = b.getRazaoSocial();
        this.nomeFantasia = b.getNomeFantasia();
        this.cnpj = b.getCnpj();
        this.rntrc = b.getRntrc();
        this.inscricaoEstadual = b.getInscricaoEstadual();
        this.responsavelOperacional = b.getResponsavelOperacional();
        this.telefoneOperacional = b.getTelefoneOperacional();
        this.tiposVeiculo = b.getTiposVeiculo();
        this.capacidadeCargaKg = b.getCapacidadeCargaKg();
        this.possuiTransporteVivo = b.isPossuiTransporteVivo();
        this.cep = b.getCep();
        this.endereco = b.getEndereco();
        this.cidade = b.getCidade();
        this.estado = b.getEstado();
        this.descricao = b.getDescricao();
    }

    public PerfilTransportadora(ContaUsuario conta, String razaoSocial, String nomeFantasia,
            String cnpj, String rntrc, String inscricaoEstadual, String responsavelOperacional,
            String telefoneOperacional, String tiposVeiculo, BigDecimal capacidadeCargaKg,
            boolean possuiTransporteVivo, String cep, String endereco,
            String cidade, String estado, String descricao) {
        this.conta = conta;
        this.razaoSocial = razaoSocial;
        this.nomeFantasia = nomeFantasia;
        this.cnpj = cnpj;
        this.rntrc = rntrc;
        this.inscricaoEstadual = inscricaoEstadual;
        this.responsavelOperacional = responsavelOperacional;
        this.telefoneOperacional = telefoneOperacional;
        this.tiposVeiculo = tiposVeiculo;
        this.capacidadeCargaKg = capacidadeCargaKg;
        this.possuiTransporteVivo = possuiTransporteVivo;
        this.cep = cep;
        this.endereco = endereco;
        this.cidade = cidade;
        this.estado = estado;
        this.descricao = descricao;
    }

    public void atualizar(String razaoSocial, String nomeFantasia, String rntrc,
            String inscricaoEstadual, String responsavelOperacional, String telefoneOperacional,
            String tiposVeiculo, BigDecimal capacidadeCargaKg, boolean possuiTransporteVivo,
            String cep, String endereco, String cidade, String estado, String descricao) {
        this.razaoSocial = razaoSocial;
        this.nomeFantasia = nomeFantasia;
        this.rntrc = rntrc;
        this.inscricaoEstadual = inscricaoEstadual;
        this.responsavelOperacional = responsavelOperacional;
        this.telefoneOperacional = telefoneOperacional;
        this.tiposVeiculo = tiposVeiculo;
        this.capacidadeCargaKg = capacidadeCargaKg;
        this.possuiTransporteVivo = possuiTransporteVivo;
        this.cep = cep;
        this.endereco = endereco;
        this.cidade = cidade;
        this.estado = estado;
        this.descricao = descricao;
    }

    @PrePersist void aoCriar() { criadoEm = LocalDateTime.now(); atualizadoEm = criadoEm; }
    @PreUpdate void aoAtualizar() { atualizadoEm = LocalDateTime.now(); }

    public Long getId() { return id; }
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
    public LocalDateTime getCriadoEm() { return criadoEm; }
}

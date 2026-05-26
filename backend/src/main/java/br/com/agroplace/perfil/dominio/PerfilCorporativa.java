package br.com.agroplace.perfil.dominio;

import br.com.agroplace.autenticacao.dominio.ContaUsuario;
import br.com.agroplace.perfil.dominio.builder.PerfilCorporativaConcretoBuilder;
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
import java.time.LocalDateTime;

@Entity
@Table(name = "perfis_corporativa")
public class PerfilCorporativa {

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

    @Column(name = "inscricao_estadual", length = 60)
    private String inscricaoEstadual;

    @Column(length = 120)
    private String segmento;

    @Column(name = "responsavel_comercial", length = 160)
    private String responsavelComercial;

    @Column(name = "telefone_comercial", length = 32)
    private String telefoneComercial;

    @Column(length = 180)
    private String site;

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

    protected PerfilCorporativa() {}

    public PerfilCorporativa(PerfilCorporativaConcretoBuilder b) {
        this.conta = b.getConta();
        this.razaoSocial = b.getRazaoSocial();
        this.nomeFantasia = b.getNomeFantasia();
        this.cnpj = b.getCnpj();
        this.inscricaoEstadual = b.getInscricaoEstadual();
        this.segmento = b.getSegmento();
        this.responsavelComercial = b.getResponsavelComercial();
        this.telefoneComercial = b.getTelefoneComercial();
        this.site = b.getSite();
        this.cep = b.getCep();
        this.endereco = b.getEndereco();
        this.cidade = b.getCidade();
        this.estado = b.getEstado();
        this.descricao = b.getDescricao();
    }

    public PerfilCorporativa(ContaUsuario conta, String razaoSocial, String nomeFantasia,
            String cnpj, String inscricaoEstadual, String segmento, String responsavelComercial,
            String telefoneComercial, String site, String cep, String endereco,
            String cidade, String estado, String descricao) {
        this.conta = conta;
        this.razaoSocial = razaoSocial;
        this.nomeFantasia = nomeFantasia;
        this.cnpj = cnpj;
        this.inscricaoEstadual = inscricaoEstadual;
        this.segmento = segmento;
        this.responsavelComercial = responsavelComercial;
        this.telefoneComercial = telefoneComercial;
        this.site = site;
        this.cep = cep;
        this.endereco = endereco;
        this.cidade = cidade;
        this.estado = estado;
        this.descricao = descricao;
    }

    public void atualizar(String razaoSocial, String nomeFantasia, String inscricaoEstadual,
            String segmento, String responsavelComercial, String telefoneComercial,
            String site, String cep, String endereco, String cidade, String estado, String descricao) {
        this.razaoSocial = razaoSocial;
        this.nomeFantasia = nomeFantasia;
        this.inscricaoEstadual = inscricaoEstadual;
        this.segmento = segmento;
        this.responsavelComercial = responsavelComercial;
        this.telefoneComercial = telefoneComercial;
        this.site = site;
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
    public String getInscricaoEstadual() { return inscricaoEstadual; }
    public String getSegmento() { return segmento; }
    public String getResponsavelComercial() { return responsavelComercial; }
    public String getTelefoneComercial() { return telefoneComercial; }
    public String getSite() { return site; }
    public String getCep() { return cep; }
    public String getEndereco() { return endereco; }
    public String getCidade() { return cidade; }
    public String getEstado() { return estado; }
    public String getDescricao() { return descricao; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
}

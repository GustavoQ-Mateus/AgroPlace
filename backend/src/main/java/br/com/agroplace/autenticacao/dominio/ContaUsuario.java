package br.com.agroplace.autenticacao.dominio;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "contas_usuario")
public class ContaUsuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 160)
    private String nome;

    @Column(nullable = false, unique = true, length = 180)
    private String email;

    @Column(nullable = false, length = 32)
    private String telefone;

    @Column(nullable = false, unique = true, length = 32)
    private String documento;

    @Column(name = "nome_empresa", length = 180)
    private String nomeEmpresa;

    @Column(name = "senha_hash", nullable = false)
    private String senhaHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_conta", nullable = false, length = 32)
    private TipoConta tipoConta;

    @Column(nullable = false)
    private boolean ativo = true;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;

    protected ContaUsuario() {
    }

    public ContaUsuario(String nome, String email, String telefone, String documento, String nomeEmpresa, String senhaHash, TipoConta tipoConta) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.documento = documento;
        this.nomeEmpresa = nomeEmpresa;
        this.senhaHash = senhaHash;
        this.tipoConta = tipoConta;
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

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }

    public String getTelefone() {
        return telefone;
    }

    public String getDocumento() {
        return documento;
    }

    public String getNomeEmpresa() {
        return nomeEmpresa;
    }

    public String getSenhaHash() {
        return senhaHash;
    }

    public TipoConta getTipoConta() {
        return tipoConta;
    }

    public boolean isAtivo() {
        return ativo;
    }
}

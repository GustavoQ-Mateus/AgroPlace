package br.com.agroplace.autenticacao.dominio.builder;

import br.com.agroplace.autenticacao.dominio.ContaUsuario;
import br.com.agroplace.autenticacao.dominio.TipoConta;

public class ContaUsuarioConcretoBuilder implements ContaUsuarioBuilder {

    private String nome;
    private String email;
    private String telefone;
    private String documento;
    private String nomeEmpresa;
    private String senhaHash;
    private TipoConta tipoConta;

    @Override
    public ContaUsuarioBuilder nome(String nome) { this.nome = nome; return this; }

    @Override
    public ContaUsuarioBuilder email(String email) { this.email = email; return this; }

    @Override
    public ContaUsuarioBuilder telefone(String telefone) { this.telefone = telefone; return this; }

    @Override
    public ContaUsuarioBuilder documento(String documento) { this.documento = documento; return this; }

    @Override
    public ContaUsuarioBuilder nomeEmpresa(String nomeEmpresa) { this.nomeEmpresa = nomeEmpresa; return this; }

    @Override
    public ContaUsuarioBuilder senhaHash(String senhaHash) { this.senhaHash = senhaHash; return this; }

    @Override
    public ContaUsuarioBuilder tipoConta(TipoConta tipoConta) { this.tipoConta = tipoConta; return this; }

    @Override
    public ContaUsuario construir() {
        validar();
        return new ContaUsuario(this);
    }

    private void validar() {
        if (nome == null || nome.isBlank()) throw new IllegalStateException("Nome é obrigatório");
        if (email == null || email.isBlank()) throw new IllegalStateException("E-mail é obrigatório");
        if (telefone == null || telefone.isBlank()) throw new IllegalStateException("Telefone é obrigatório");
        if (documento == null || documento.isBlank()) throw new IllegalStateException("Documento é obrigatório");
        if (senhaHash == null || senhaHash.isBlank()) throw new IllegalStateException("Senha é obrigatória");
        if (tipoConta == null) throw new IllegalStateException("Tipo de conta é obrigatório");
    }

    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public String getTelefone() { return telefone; }
    public String getDocumento() { return documento; }
    public String getNomeEmpresa() { return nomeEmpresa; }
    public String getSenhaHash() { return senhaHash; }
    public TipoConta getTipoConta() { return tipoConta; }
}

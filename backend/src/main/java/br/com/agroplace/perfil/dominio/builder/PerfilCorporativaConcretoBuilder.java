package br.com.agroplace.perfil.dominio.builder;

import br.com.agroplace.autenticacao.dominio.ContaUsuario;
import br.com.agroplace.perfil.dominio.PerfilCorporativa;

public class PerfilCorporativaConcretoBuilder implements PerfilCorporativaBuilder {

    private ContaUsuario conta;
    private String razaoSocial;
    private String nomeFantasia;
    private String cnpj;
    private String inscricaoEstadual;
    private String segmento;
    private String responsavelComercial;
    private String telefoneComercial;
    private String site;
    private String cep;
    private String endereco;
    private String cidade;
    private String estado;
    private String descricao;

    @Override
    public PerfilCorporativaBuilder conta(ContaUsuario conta) { this.conta = conta; return this; }

    @Override
    public PerfilCorporativaBuilder razaoSocial(String razaoSocial) { this.razaoSocial = razaoSocial; return this; }

    @Override
    public PerfilCorporativaBuilder nomeFantasia(String nomeFantasia) { this.nomeFantasia = nomeFantasia; return this; }

    @Override
    public PerfilCorporativaBuilder cnpj(String cnpj) { this.cnpj = cnpj; return this; }

    @Override
    public PerfilCorporativaBuilder inscricaoEstadual(String inscricaoEstadual) { this.inscricaoEstadual = inscricaoEstadual; return this; }

    @Override
    public PerfilCorporativaBuilder segmento(String segmento) { this.segmento = segmento; return this; }

    @Override
    public PerfilCorporativaBuilder responsavelComercial(String responsavelComercial) { this.responsavelComercial = responsavelComercial; return this; }

    @Override
    public PerfilCorporativaBuilder telefoneComercial(String telefoneComercial) { this.telefoneComercial = telefoneComercial; return this; }

    @Override
    public PerfilCorporativaBuilder site(String site) { this.site = site; return this; }

    @Override
    public PerfilCorporativaBuilder cep(String cep) { this.cep = cep; return this; }

    @Override
    public PerfilCorporativaBuilder endereco(String endereco) { this.endereco = endereco; return this; }

    @Override
    public PerfilCorporativaBuilder cidade(String cidade) { this.cidade = cidade; return this; }

    @Override
    public PerfilCorporativaBuilder estado(String estado) { this.estado = estado; return this; }

    @Override
    public PerfilCorporativaBuilder descricao(String descricao) { this.descricao = descricao; return this; }

    @Override
    public PerfilCorporativa construir() {
        validar();
        return new PerfilCorporativa(this);
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
}

package br.com.agroplace.perfil.dominio.builder;

import br.com.agroplace.autenticacao.dominio.ContaUsuario;
import br.com.agroplace.perfil.dominio.PerfilCorporativa;

public interface PerfilCorporativaBuilder {
    PerfilCorporativaBuilder conta(ContaUsuario conta);
    PerfilCorporativaBuilder razaoSocial(String razaoSocial);
    PerfilCorporativaBuilder nomeFantasia(String nomeFantasia);
    PerfilCorporativaBuilder cnpj(String cnpj);
    PerfilCorporativaBuilder inscricaoEstadual(String inscricaoEstadual);
    PerfilCorporativaBuilder segmento(String segmento);
    PerfilCorporativaBuilder responsavelComercial(String responsavelComercial);
    PerfilCorporativaBuilder telefoneComercial(String telefoneComercial);
    PerfilCorporativaBuilder site(String site);
    PerfilCorporativaBuilder cep(String cep);
    PerfilCorporativaBuilder endereco(String endereco);
    PerfilCorporativaBuilder cidade(String cidade);
    PerfilCorporativaBuilder estado(String estado);
    PerfilCorporativaBuilder descricao(String descricao);
    PerfilCorporativa construir();
}

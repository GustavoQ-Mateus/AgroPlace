package br.com.agroplace.autenticacao.dominio.builder;

import br.com.agroplace.autenticacao.dominio.ContaUsuario;
import br.com.agroplace.autenticacao.dominio.TipoConta;

public interface ContaUsuarioBuilder {
    ContaUsuarioBuilder nome(String nome);
    ContaUsuarioBuilder email(String email);
    ContaUsuarioBuilder telefone(String telefone);
    ContaUsuarioBuilder documento(String documento);
    ContaUsuarioBuilder nomeEmpresa(String nomeEmpresa);
    ContaUsuarioBuilder senhaHash(String senhaHash);
    ContaUsuarioBuilder tipoConta(TipoConta tipoConta);
    ContaUsuario construir();
}

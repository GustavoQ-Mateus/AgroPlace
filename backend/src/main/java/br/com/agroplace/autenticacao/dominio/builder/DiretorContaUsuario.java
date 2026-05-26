package br.com.agroplace.autenticacao.dominio.builder;

import br.com.agroplace.autenticacao.dominio.ContaUsuario;
import br.com.agroplace.autenticacao.dominio.TipoConta;

public class DiretorContaUsuario {

    private final ContaUsuarioBuilder builder;

    public DiretorContaUsuario(ContaUsuarioBuilder builder) {
        this.builder = builder;
    }

    public ContaUsuario construirConta(String nome, String email, String telefone,
            String documento, String nomeEmpresa, String senhaHash, TipoConta tipoConta) {
        return builder
                .nome(nome)
                .email(email)
                .telefone(telefone)
                .documento(documento)
                .nomeEmpresa(nomeEmpresa)
                .senhaHash(senhaHash)
                .tipoConta(tipoConta)
                .construir();
    }
}

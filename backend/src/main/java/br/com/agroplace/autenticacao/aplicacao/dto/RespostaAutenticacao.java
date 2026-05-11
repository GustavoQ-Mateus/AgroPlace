package br.com.agroplace.autenticacao.aplicacao.dto;

public record RespostaAutenticacao(
    Long id,
    String nome,
    String email,
    String telefone,
    String documento,
    String nomeEmpresa,
    String tipoConta,
    String codigoAcesso
) {
}
